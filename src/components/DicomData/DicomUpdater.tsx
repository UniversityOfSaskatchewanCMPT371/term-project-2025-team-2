/**
 * from https://github.com/milung/dicom-editor
 */

interface Sequence {
    entry: any;
    length: number;
}

enum ChangeType {
    ADD,
    EDIT,
    REMOVE,
}

enum NUMBERS {
    "FD",
    "FL",
    "UL",
    "US",
    "SL",
    "SS",
}
enum VR_with_12_bytes_header {
    "VR",
    "OB",
    "OD",
    "OF",
    "OL",
    "OW",
    "SQ",
    "UC",
    "UR",
    "UT",
    "UN",
}
const groupLen = 2;
const elementLen = 2;
const vrLen = 2;
const lengthLen = 2;
const longHeaderLengthLen = 4;
const headerLen = 8;
const longHeaderLen = 12;
const vrOffset = 4;
const lengthOffset = 6;
const longHeaderLengthOffset = 8;
const itemLengthOffset = 4;

export class DicomUpdater {
    /**
     * @param buffer array to insert a tag to
     * @param tag tag (array) to insert
     * @param offset  where to insert the tag
     * @description inserts a tag (Uint8Array) to another array at the offset
     * @return array incluing the tag
     */
    public insertTag(buffer: Uint8Array, tag: Uint8Array, offset: number) {
        const buffer1 = buffer.slice(0, offset);
        const buffer2 = buffer.slice(offset);
        const buffer3 = this.concatBuffers(buffer1, tag);
        return this.concatBuffers(buffer3, buffer2);
    }

    /**
     * @param buffer array to remove a tag from
     * @param tag any to remove
     * @description removes a tag from Uint8Array
     * @return array without the tag
     */
    public removeTag(buffer: Uint8Array, tag: any) {
        const buffer1 = buffer.slice(0, tag.offset);
        const buffer2 = buffer.slice(tag.offset + tag.byteLength);
        return this.concatBuffers(buffer1, buffer2);
    }

    /**
     * @param buffer array to change
     * @param tag any to remove
     * @param newTag new tag to replace the old
     * @description replaces a tag in array
     * @return array without the old tag including newTag
     */
    public replaceTag(buffer: Uint8Array, tag: any, newTag: Uint8Array) {
        const beginning = buffer.slice(0, tag.offset);
        const end = buffer.slice(tag.offset + tag.byteLength);
        const updatedBuffer = new Uint8Array(
            beginning.length + newTag.length + end.length
        );
        updatedBuffer.set(beginning);
        updatedBuffer.set(newTag, beginning.length);
        updatedBuffer.set(end, beginning.length + newTag.length);
        return updatedBuffer;
    }

    /**
     * @param file file to apply changes to
     * @description applies all unsaved changes to file buffered data
     * @return changed file buffered data
     */
    public applyAllChanges(file: any) {
        let buffer = file.bufferedData;
        let changes = file.unsavedChanges || [];
        let sequences: Sequence[] = [];
        const littleEndian: boolean = this.getEndian(file.dicomData.entries);

        if (changes) {
            sequences = this.getSequences(
                sequences,
                file.dicomData.entries,
                buffer,
                littleEndian
            );
            changes = this.handleSequenceChanges(changes, sequences);

            changes.forEach((change: any) => {
                if (change.type === ChangeType.ADD) {
                    const newTagName: Uint8Array = this.writeTagName(
                        change.entry.tagGroup,
                        change.entry.tagElement,
                        littleEndian
                    );
                    const newTag: Uint8Array = this.createTag(
                        newTagName,
                        change.entry,
                        littleEndian
                    );
                    const offset: number = this.findOffsetForNewTag(
                        file.dicomData.entries,
                        change.entry
                    );
                    buffer = this.insertTag(buffer, newTag, offset);
                    sequences = this.checkSequences(
                        sequences,
                        change,
                        newTag.length
                    );
                } else if (change.type === ChangeType.EDIT) {
                    if (
                        change.entry.tagVR === "SQ" ||
                        change.entry.tagVR === "item"
                    ) {
                        let currentSequence: Sequence | undefined =
                            sequences.shift();
                        while (
                            currentSequence &&
                            currentSequence.entry.id !== change.entry.id
                        ) {
                            currentSequence = sequences.shift();
                        }
                        if (
                            currentSequence &&
                            currentSequence.entry.byteLength !==
                                currentSequence.length
                        ) {
                            buffer = this.rewriteSQlength(
                                buffer,
                                currentSequence,
                                littleEndian
                            );
                        }
                    } else {
                        const tagName: Uint8Array = this.getElementAndGroup(
                            buffer,
                            change.entry.offset
                        );
                        const newTag: Uint8Array = this.createTag(
                            tagName,
                            change.entry,
                            littleEndian
                        );
                        buffer = this.replaceTag(buffer, change.entry, newTag);
                        sequences = this.checkSequences(
                            sequences,
                            change,
                            newTag.length
                        );
                    }
                } else if (change.type === ChangeType.REMOVE) {
                    buffer = this.removeTag(buffer, change.entry);
                    sequences = this.checkSequences(sequences, change, 0);
                }
            });
        }
        return buffer;
    }

    public getEndian(entries: any[]) {
        let littleEndian: boolean = true;
        entries.forEach((element) => {
            if (
                element.tagGroup === "0002" &&
                element.tagElement === "0010" &&
                element.tagValue === "1.2.840.10008.1.2.2"
            ) {
                littleEndian = false;
            }
        });
        return littleEndian;
    }

    /**
     * @param sequences sequences to be checked
     * @param change a tag which has been changed
     * @param newLength new length od the changed tag in bytearray
     * @description checks if the changed tag belonges to any of the sequences and updates the seqence lengths
     * @return sequences with updated lengths
     */
    public checkSequences(
        sequences: Sequence[],
        change: any,
        newLength: number
    ) {
        sequences.forEach((s) => {
            if (
                s.entry.offset + s.length > change.entry.offset &&
                JSON.stringify(s.entry) !== JSON.stringify(change.entry)
            ) {
                const difference = newLength - change.entry.byteLength;
                s.length = s.length + difference;
            }
        });
        return sequences;
    }

    /**
     * @param buffer bytearray in which the SQ length should be rewritten
     * @param sequence the sequence to have its length updated in the bytearray
     * @description changes the length of a sequence in the bytearray
     * @return buffer with the updated SQ lenth
     */
    public rewriteSQlength(
        buffer: Uint8Array,
        sequence: Sequence,
        littleEndian: boolean
    ) {
        const headerLength =
            sequence.entry.tagVR === "SQ" ? longHeaderLen : headerLen;
        const lengthOff =
            sequence.entry.tagVR === "SQ"
                ? longHeaderLengthOffset
                : itemLengthOffset;
        const beginning = buffer.slice(0, sequence.entry.offset + lengthOff);
        const end = buffer.slice(sequence.entry.offset + headerLength);
        const newSQlength = this.writeTypedNumber(
            sequence.length - headerLength,
            "uint32",
            4,
            littleEndian
        );
        const updatedBuffer = new Uint8Array(buffer.length);
        updatedBuffer.set(beginning);
        updatedBuffer.set(newSQlength, beginning.length);
        updatedBuffer.set(end, beginning.length + newSQlength.length);
        return updatedBuffer;
    }

    /**
     * @param tagName tag's group and element in bytearray
     * @param tag dicom entry to be written to bytearray
     * @description creates a bytearray representing the tag
     * @return tag's bytearray
     */
    public createTag(tagName: Uint8Array, tag: any, littleEndian: boolean) {
        const valueOffset = this.getHeaderLength(tag);
        const valueLength = this.getValueLength(tag);
        let atGroup = 0;
        let atElement = 0;

        const tagVR = this.writeVRArray(tag.tagVR);
        const tagLength =
            valueOffset === longHeaderLen
                ? this.writeTypedNumber(
                      valueLength,
                      "uint32",
                      longHeaderLengthLen,
                      littleEndian
                  )
                : this.writeTypedNumber(
                      valueLength,
                      "uint16",
                      lengthLen,
                      littleEndian
                  );
        const newTag = new Uint8Array(valueLength + valueOffset);
        newTag.set(tagName);
        newTag.set(tagVR, vrOffset);
        newTag.set(tagLength, lengthOffset);

        switch (tag.tagVR) {
            case "FD":
                newTag.set(
                    this.writeTypedNumber(
                        parseInt(tag.tagValue, 10),
                        "double",
                        valueLength,
                        littleEndian
                    ),
                    valueOffset
                );
                break;
            case "FL":
                newTag.set(
                    this.writeTypedNumber(
                        parseInt(tag.tagValue, 10),
                        "float",
                        valueLength,
                        littleEndian
                    ),
                    valueOffset
                );
                break;
            case "UL":
                newTag.set(
                    this.writeTypedNumber(
                        parseInt(tag.tagValue, 10),
                        "uint32",
                        valueLength,
                        littleEndian
                    ),
                    valueOffset
                );
                break;
            case "US":
                newTag.set(
                    this.writeTypedNumber(
                        parseInt(tag.tagValue, 10),
                        "uint16",
                        valueLength,
                        littleEndian
                    ),
                    valueOffset
                );
                break;
            case "SL":
                newTag.set(
                    this.writeTypedNumber(
                        parseInt(tag.tagValue, 10),
                        "int32",
                        valueLength,
                        littleEndian
                    ),
                    valueOffset
                );
                break;
            case "SS":
                newTag.set(
                    this.writeTypedNumber(
                        parseInt(tag.tagValue, 10),
                        "int16",
                        valueLength,
                        littleEndian
                    ),
                    valueOffset
                );
                break;
            case "AT":
                atGroup = parseInt(tag.tagValue.slice(0, 4), 16);
                atElement = parseInt(tag.tagValue.slice(4), 16);
                newTag.set(
                    this.writeTypedNumber(
                        atGroup,
                        "uint16",
                        valueLength / 2,
                        littleEndian
                    ),
                    valueOffset
                );
                newTag.set(
                    this.writeTypedNumber(
                        atElement,
                        "uint16",
                        valueLength / 2,
                        littleEndian
                    ),
                    valueOffset + 2
                );
                break;
            default:
                for (let i = 0; i < tag.tagValue.length; i++) {
                    newTag[i + 8] = tag.tagValue.charCodeAt(i);
                }
                break;
        }
        return newTag;
    }

    /**
     * @param tag dicom entry
     * @return tag's header length in bytes according to its VR
     */
    private getHeaderLength(tag: any) {
        return tag.tagVR in VR_with_12_bytes_header ? longHeaderLen : headerLen;
    }

    /**
     * @param sequences array of sequences which is then returned
     * @param entries dicom entries
     * @return all sequence tags as Sequence[] from entries
     */
    private getSequences(
        sequences: Sequence[],
        entries: any[],
        buffer: Uint8Array,
        littleEndian: boolean
    ) {
        entries.forEach((entry) => {
            if (entry.tagVR === "SQ") {
                sequences.push({ entry: entry, length: entry.byteLength });
                const items = this.getItemsFromSequenceAsSequences(
                    entry,
                    buffer,
                    littleEndian
                );
                sequences = sequences.concat(items);
                this.getSequences(
                    sequences,
                    entry.sequence,
                    buffer,
                    littleEndian
                );
            }
        });
        sequences = this.orderByOffset(sequences) as Sequence[];
        return sequences;
    }

    /**
     *
     * @param entry a 'SQ' entry which items are returned
     * @param buffer whole bytearray with SQ,its items and other tags
     * @param littleEndian defines whether the file's content is written in little or big endian
     * @description gets all items from a sequence, so that their length is ajdusted as well when inner tags are changed
     */
    private getItemsFromSequenceAsSequences(
        entry: any,
        buffer: Uint8Array,
        littleEndian: boolean
    ) {
        const items: Sequence[] = [];
        let currentItemOffset = entry.offset + longHeaderLen;
        let bytelength: number;
        let itemLengthArray: Uint8Array;
        while (currentItemOffset < entry.offset + entry.byteLength) {
            itemLengthArray = buffer.slice(
                currentItemOffset + itemLengthOffset,
                currentItemOffset + headerLen
            );
            bytelength =
                this.readUint32(itemLengthArray, littleEndian) + headerLen;
            items.push({
                entry: {
                    id: -1,
                    offset: currentItemOffset,
                    byteLength: bytelength,
                    tagGroup: "FFFE",
                    tagElement: "E000",
                    tagName: "",
                    tagValue: "",
                    tagVR: "item",
                    tagVM: "",
                    colour: "",
                    sequence: [],
                },
                length: bytelength,
            });
            currentItemOffset += bytelength;
        }
        return items;
    }

    /**
     * @param buffer uint8array with the four bytes representing an integer
     * @param littleEndian int encoding
     * @description reads a unsigned 4 B integer from a bytearray
     */
    private readUint32(buffer: Uint8Array, littleEndian: boolean) {
        let result: number = 0;
        if (littleEndian) {
            for (let i = 0; i < 4; i++) {
                result += buffer[i] * Math.pow(256, i);
            }
        } else {
            for (let i = 3; i >= 0; i--) {
                result += buffer[i] * Math.pow(256, 3 - i);
            }
        }
        return result;
    }

    /**
     * @param sequences array of sequences to add to changes
     * @param changes dicom entries to be changed
     * @return changes with sequences added
     */
    private addSequences(changes: any[], sequences: Sequence[]) {
        sequences.forEach((s) => {
            changes.push({ entry: s.entry, type: ChangeType.EDIT });
        });
        return this.orderByOffset(changes);
    }

    /**
     * @param array array to be ordered
     * @return array ordered by offset
     */
    private orderByOffset(array: (any | Sequence)[]) {
        array.sort(function (
            element1: any | Sequence,
            element2: any | Sequence
        ) {
            return element2.entry.offset - element1.entry.offset;
        });
        return array;
    }

    /**
     * @param changes dicom entries to be changed
     * @param sequences array of all sequences
     * @description removes changes within the sequences which are to be removed
     * @return changes with added sequences, ordered by offset
     */
    private handleSequenceChanges(changes: any[], sequences: Sequence[]) {
        changes = this.orderByOffset(changes) as any[];
        for (let i = changes.length - 1; i >= 0; i--) {
            if (changes[i].entry.tagVR === "SQ") {
                const sqOffset = changes[i].entry.offset;
                const sqLength = changes[i].entry.byteLength;
                while (
                    i - 1 >= 0 &&
                    changes[--i].entry.offset < sqOffset + sqLength
                ) {
                    changes.splice(i, 1);
                    i--;
                }
            }
        }
        changes = this.addSequences(changes, sequences) as any[];
        return this.orderByOffset(changes) as any[];
    }

    /**
     * @param buffer byte array - buffered data
     * @param offset the offset of the tag's group
     * @return returns tag's group and element as bytearray from buffer
     */
    private getElementAndGroup(buffer: Uint8Array, offset: number): Uint8Array {
        const ElementAndGroupLength = elementLen + groupLen;
        const result = buffer.slice(offset, offset + ElementAndGroupLength);
        return result;
    }

    /**
     * @param tag dicom entry
     * @return bytelength of the tag's value
     */
    private getValueLength(tag: any) {
        if (tag.tagVR in NUMBERS) {
            let value = parseInt(tag.tagValue, 10);
            let byteLength = 1;
            /* tslint:disable */
            while ((value >>= 8) > 0) {
                /* tslint:enable */
                byteLength++;
            }
            switch (tag.tagVR[1]) {
                case "S":
                    byteLength += 2 - (byteLength % 2);
                    break;
                case "L":
                    byteLength += 4 - (byteLength % 4);
                    break;
                case "D":
                    byteLength += 8 - (byteLength % 8);
                    break;
                default:
                    break;
            }
            return byteLength;
        } else if (tag.tagVR === "AT") {
            return 4;
        } else {
            return tag.tagValue.length;
        }
    }

    /**
     * @param entries
     * @param newTag tag that needs to be placed in the bytearray
     * @description finds offset for a tag according to tag attribute (group+element)
     * @return offset for new tag
     */
    private findOffsetForNewTag(entries: any[], newTag: any) {
        const newTagAttribute = newTag.tagGroup.concat(newTag.tagElement);
        let i = 0;
        entries.sort(function (element1: any, element2: any) {
            return element1.offset - element2.offset;
        });
        for (i = 0; i < entries.length; i++) {
            const tagAttribute = entries[i].tagGroup.concat(
                entries[i].tagElement
            );
            if (
                tagAttribute > newTagAttribute ||
                tagAttribute === newTagAttribute
            ) {
                return entries[i].offset;
            }
        }
        return entries[i - 1].offset + entries[i - 1].byteLength;
    }

    /**
     * @param tagGroup string representation of a tag's group (hexa number)
     * @param tagElement string representation of a tag's element (hexa number)
     * @return bytearray of tagGroup and tagElement
     */
    private writeTagName(
        tagGroup: string,
        tagElement: string,
        littleEndian: boolean
    ) {
        const group = this.writeTypedNumber(
            parseInt(tagGroup, 16),
            "uint16",
            groupLen,
            littleEndian
        );
        const element = this.writeTypedNumber(
            parseInt(tagElement, 16),
            "uint16",
            elementLen,
            littleEndian
        );
        const tagName = new Uint8Array(groupLen + elementLen);
        tagName.set(group);
        tagName.set(element, groupLen);
        return tagName;
    }

    /**
     * @param vr string representation of a VR (value representation)
     * @return vr in bytearray
     */
    private writeVRArray(vr: string) {
        const vrArray = new Uint8Array(vrLen);
        for (let i = 0; i < 2; i++) {
            vrArray[i] = vr.charCodeAt(i);
        }
        return vrArray;
    }

    /**
     * @param num number to be written
     * @param type defines the number type: e.g. unsigned 16 B integer - uint16
     * @return bytearray of the number
     */
    private writeTypedNumber(
        num: number,
        type: string,
        arrayLength: number,
        littleEndian: boolean
    ) {
        const arrbuff = new ArrayBuffer(arrayLength);
        const view = new DataView(arrbuff);
        switch (type) {
            case "uint16":
                view.setUint16(0, num, littleEndian);
                break;
            case "uint32":
                view.setUint16(0, num, littleEndian);
                break;
            case "int8":
                view.setInt8(0, num);
                break;
            case "int16":
                view.setInt16(0, num, littleEndian);
                break;
            case "int32":
                view.setInt32(0, num, littleEndian);
                break;
            case "float":
                view.setFloat32(0, num, littleEndian);
                break;
            case "double":
                view.setFloat64(0, num, littleEndian);
                break;
            default:
                break;
        }
        return new Uint8Array(arrbuff);
    }

    /**
     * @param buffer1 bytearray to be joined (head)
     * @param buffer2 bytearray to be joined (tail)
     * @return bytearray consisting of joined buffer1 and buffer2
     */
    private concatBuffers(
        bufffer1: Uint8Array,
        buffer2: Uint8Array
    ): Uint8Array {
        const concatedBuffer = new Uint8Array(bufffer1.length + buffer2.length);
        concatedBuffer.set(bufffer1);
        concatedBuffer.set(buffer2, bufffer1.length);
        return concatedBuffer;
    }
}
