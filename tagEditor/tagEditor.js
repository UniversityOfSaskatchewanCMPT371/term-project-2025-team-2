

export function saveUpdaetdTag(dataSet) {
    let modifidedTags = updateTagValue(dataSet);
    downloadModifiedDicom(modifidedTags, dataSet);
}

// not a goog way to do this
function updateTagValue(dataSet) {
    if (!dataSet) return;

    let modifiedTags = new Map();

    const input = document.querySelectorAll("#tag-row");

    input.forEach((item) => {
        const tag = item.children[0].textContent;
        const newValue = item.children[2].children[0].value;
        modifiedTags.set(tag, newValue);
    });

    return modifiedTags;
}


function downloadModifiedDicom(modifiedTags, dataSet) {

    // Early validation checks
    if (!dataSet) {
        console.error("No DICOM dataset loaded");
        return;
    }

    // Ensure modifiedTags is a Map and not empty
    if (!(modifiedTags instanceof Map) || modifiedTags.size === 0) {
        console.warn("No tags modified");
        return;
    }

    let editor = new DicomEditor();

}



class DicomEditor {

    /**
     * @param buffer array to insert a tag to
     * @param tag tag (array) to insert
     * @param offset  where to insert the tag
     * @description inserts a tag (Uint8Array) to another array at the offset
     * @return array incluing the tag
     */
    insertTag(buffer, tag, offset) {
        let buffer1 = buffer.slice(0, offset);
        let buffer2 = buffer.slice(offset, );
        let buffer3 = this.concatBuffers(buffer1, tag);
        return this.concatBuffers(buffer3, buffer2);
    }

    /**
     * @param buffer array to remove a tag from
     * @param tag DicomEntry to remove
     * @description removes a tag from Uint8Array
     * @return array without the tag
     */
    removeTag(buffer, tag) {
        let buffer1 = buffer.slice(0, tag.offset);
        let buffer2 = buffer.slice(tag.offset + tag.byteLength, );
        return this.concatBuffers(buffer1, buffer2);
    }

    /**
     * @param buffer array to change
     * @param tag DicomEntry to remove
     * @param newTag new tag to replace the old
     * @description replaces a tag in array
     * @return array without the old tag including newTag
     */
    replaceTag(buffer, tag, newTag) {
        let beginning = buffer.slice(0, tag.offset);
        let end = buffer.slice(tag.offset + tag.byteLength);
        let updatedBuffer = new Uint8Array(beginning.length + newTag.length + end.length);
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
    applyAllChanges(file) {
        let buffer = file.bufferedData;
        let changes = file.unsavedChanges || [];
        let sequences = [];
        let littleEndian = this.getEndian(file.dicomData.entries);

        if (changes) {

            sequences = this.getSequences(sequences, file.dicomData.entries, buffer, littleEndian);
            changes = this.handleSequenceChanges(changes, sequences);

            changes.forEach(change => {

                if (change.type === ChangeType.ADD) {
                    let newTagName = this.writeTagName(change.entry.tagGroup, change.entry.tagElement, littleEndian);
                    let newTag = this.createTag(newTagName, change.entry, littleEndian);
                    let offset = this.findOffsetForNewTag(file.dicomData.entries, change.entry);
                    buffer = this.insertTag(buffer, newTag, offset);
                    sequences = this.checkSequences(sequences, change, newTag.length);

                } else if (change.type === ChangeType.EDIT) {

                    if (change.entry.tagVR === 'SQ' || change.entry.tagVR === 'item') {
                        let currentSequence = sequences.shift();
                        while (currentSequence && currentSequence.entry.id !== change.entry.id) {
                            currentSequence = sequences.shift();
                        }
                        if (currentSequence && currentSequence.entry.byteLength !== currentSequence.length) {
                            buffer = this.rewriteSQlength(buffer, currentSequence, littleEndian);
                        }
                    } else {
                        let tagName = this.getElementAndGroup(buffer, change.entry.offset);
                        let newTag = this.createTag(tagName, change.entry, littleEndian);
                        buffer = this.replaceTag(buffer, change.entry, newTag);
                        sequences = this.checkSequences(sequences, change, newTag.length);
                    }

                } else if (change.type === ChangeType.REMOVE) {
                    buffer = this.removeTag(buffer, change.entry);
                    sequences = this.checkSequences(sequences, change, 0);
                }
            });
        }
        return buffer;
    }

    getEndian(entries) {
        let littleEndian = true;
        entries.forEach(element => {
            if (element.tagGroup === '0002' &&
                element.tagElement === '0010' &&
                element.tagValue === '1.2.840.10008.1.2.2') {
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
    checkSequences(sequences, change, newLength) {
        sequences.forEach(s => {
            if (s.entry.offset + s.length > change.entry.offset &&
                JSON.stringify(s.entry) !== JSON.stringify(change.entry)) {
                let difference = newLength - change.entry.byteLength;
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
    rewriteSQlength(buffer, sequence, littleEndian) {
        let headerLength = sequence.entry.tagVR === 'SQ' ? longHeaderLen : headerLen;
        let lengthOff = sequence.entry.tagVR === 'SQ' ? longHeaderLengthOffset : itemLengthOffset;
        let beginning = buffer.slice(0, sequence.entry.offset + lengthOff);
        let end = buffer.slice(sequence.entry.offset + headerLength, );
        let newSQlength = this.writeTypedNumber(sequence.length - headerLength, 'uint32', 4, littleEndian);
        let updatedBuffer = new Uint8Array(buffer.length);
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
    createTag(tagName, tag, littleEndian) {
        let valueOffset = this.getHeaderLength(tag);
        let valueLength = this.getValueLength(tag);

        let tagVR = this.writeVRArray(tag.tagVR);
        let tagLength = valueOffset === longHeaderLen ?
            this.writeTypedNumber(valueLength, 'uint32', longHeaderLengthLen, littleEndian) :
            this.writeTypedNumber(valueLength, 'uint16', lengthLen, littleEndian);
        let newTag = new Uint8Array(valueLength + valueOffset);
        newTag.set(tagName);
        newTag.set(tagVR, vrOffset);
        newTag.set(tagLength, lengthOffset);

        switch (tag.tagVR) {
            case 'FD':
                newTag.set(
                    this.writeTypedNumber(parseInt(tag.tagValue, 10), 'double', valueLength, littleEndian),
                    valueOffset);
                break;
            case 'FL':
                newTag.set(
                    this.writeTypedNumber(parseInt(tag.tagValue, 10), 'float', valueLength, littleEndian),
                    valueOffset);
                break;
            case 'UL':
                newTag.set(
                    this.writeTypedNumber(parseInt(tag.tagValue, 10), 'uint32', valueLength, littleEndian),
                    valueOffset);
                break;
            case 'US':
                newTag.set(
                    this.writeTypedNumber(parseInt(tag.tagValue, 10), 'uint16', valueLength, littleEndian),
                    valueOffset);
                break;
            case 'SL':
                newTag.set(
                    this.writeTypedNumber(parseInt(tag.tagValue, 10), 'int32', valueLength, littleEndian),
                    valueOffset);
                break;
            case 'SS':
                newTag.set(
                    this.writeTypedNumber(parseInt(tag.tagValue, 10), 'int16', valueLength, littleEndian),
                    valueOffset);
                break;
            case 'AT':
                let atGroup = parseInt(tag.tagValue.slice(0, 4), 16);
                let atElement = parseInt(tag.tagValue.slice(4, ), 16);
                newTag.set(this.writeTypedNumber(atGroup, 'uint16', valueLength / 2, littleEndian), valueOffset);
                newTag.set(this.writeTypedNumber(atElement, 'uint16', valueLength / 2, littleEndian), valueOffset + 2);
                break;
            default:
                for (var i = 0; i < tag.tagValue.length; i++) {
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
    getHeaderLength(tag) {
        return tag.tagVR in VR_with_12_bytes_header ? longHeaderLen : headerLen;
    }

    /**
     * @param sequences array of sequences which is then returned
     * @param entries dicom entries
     * @return all sequence tags as Sequence[] from entries
     */
    getSequences(sequences, entries, buffer, littleEndian) {
        entries.forEach(entry => {
            if (entry.tagVR === 'SQ') {
                sequences.push({ entry: entry, length: entry.byteLength });
                let items = this.getItemsFromSequenceAsSequences(entry, buffer, littleEndian);
                sequences = sequences.concat(items);
                this.getSequences(sequences, entry.sequence, buffer, littleEndian);
            }
        });
        sequences = this.orderByOffset(sequences);
        return sequences;
    }

    /**
     * 
     * @param entry a 'SQ' entry which items are returned
     * @param buffer whole bytearray with SQ,its items and other tags
     * @param littleEndian defines whether the file's content is written in little or big endian
     * @description gets all items from a sequence, so that their length is ajdusted as well when inner tags are changed
     */
    getItemsFromSequenceAsSequences(entry, buffer, littleEndian) {
        let items = [];
        let currentItemOffset = entry.offset + longHeaderLen;
        let bytelength;
        let itemLengthArray;
        while (currentItemOffset < entry.offset + entry.byteLength) {
            itemLengthArray = buffer.slice(currentItemOffset + itemLengthOffset, currentItemOffset + headerLen);
            bytelength = this.readUint32(itemLengthArray, littleEndian) + headerLen;
            items.push({
                entry: {
                    id: -1,
                    offset: currentItemOffset,
                    byteLength: bytelength,
                    tagGroup: 'FFFE',
                    tagElement: 'E000',
                    tagName: '',
                    tagValue: '',
                    tagVR: 'item',
                    tagVM: '',
                    colour: '',
                    sequence: [],
                },
                length: bytelength
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
    readUint32(buffer, littleEndian) {
        let result = 0;
        if (littleEndian) {
            for (let i = 0; i < 4; i++) {
                result += (buffer[i] * Math.pow(256, i));
            }
        } else {
            for (let i = 3; i >= 0; i--) {
                result += (buffer[i] * Math.pow(256, 3 - i));
            }
        }
        return result;
    }

    /**
     * @param sequences array of sequences to add to changes
     * @param changes dicom entries to be changed
     * @return changes with sequences added
     */
    addSequences(changes, sequences) {
        sequences.forEach(s => {
            changes.push({ entry: s.entry, type: ChangeType.EDIT });
        });
        return this.orderByOffset(changes);
    }

    /**
     * @param array array to be ordered
     * @return array ordered by offset
     */
    orderByOffset(array) {
        array.sort(
            function (element1, element2) {
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
    handleSequenceChanges(changes, sequences) {
        changes = this.orderByOffset(changes);
        for (var i = changes.length - 1; i >= 0; i--) {
            if (changes[i].entry.tagVR === 'SQ') {
                let sqOffset = changes[i].entry.offset;
                let sqLength = changes[i].entry.byteLength;
                while (i - 1 >= 0 && changes[--i].entry.offset < sqOffset + sqLength) {
                    changes.splice(i, 1);
                    i--;
                }
            }
        }
        changes = this.addSequences(changes, sequences);
        return this.orderByOffset(changes);
    }

    /**
     * @param buffer byte array - buffered data
     * @param offset the offset of the tag's group
     * @return returns tag's group and element as bytearray from buffer
     */
    getElementAndGroup(buffer, offset) {
        let ElementAndGroupLength = elementLen + groupLen;
        let result = buffer.slice(offset, offset + ElementAndGroupLength);
        return result;
    }

    /**
     * @param tag dicom entry
     * @return bytelength of the tag's value
     */
    getValueLength(tag) {
        if (tag.tagVR in NUMBERS) {
            let value = parseInt(tag.tagValue, 10);
            let byteLength = 1;
            /* tslint:disable */
            while ((value >>= 8) > 0) {
                /* tslint:enable */
                byteLength++;
            }
            switch (tag.tagVR[1]) {
                case 'S':
                    byteLength += (2 - byteLength % 2);
                    break;
                case 'L':
                    byteLength += (4 - byteLength % 4);
                    break;
                case 'D':
                    byteLength += (8 - byteLength % 8);
                    break;
                default:
                    break;
            }
            return byteLength;
        } else if (tag.tagVR === 'AT') {
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
    findOffsetForNewTag(entries, newTag) {
        let newTagAttribute = newTag.tagGroup.concat(newTag.tagElement);
        entries.sort(
            function (element1, element2) {
                return element1.offset - element2.offset;
            });
        for (var i = 0; i < entries.length; i++) {
            let tagAttribute = entries[i].tagGroup.concat(entries[i].tagElement);
            if (tagAttribute > newTagAttribute || tagAttribute === newTagAttribute) {
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
    writeTagName(tagGroup, tagElement, littleEndian) {
        let group = this.writeTypedNumber(parseInt(tagGroup, 16), 'uint16', groupLen, littleEndian);
        let element = this.writeTypedNumber(parseInt(tagElement, 16), 'uint16', elementLen, littleEndian);
        let tagName = new Uint8Array(groupLen + elementLen);
        tagName.set(group);
        tagName.set(element, groupLen);
        return tagName;
    }

    /**
     * @param vr string representation of a VR (value representation)
     * @return vr in bytearray
     */
    writeVRArray(vr) {
        let vrArray = new Uint8Array(vrLen);
        for (var i = 0; i < 2; i++) {
            vrArray[i] = vr.charCodeAt(i);
        }
        return vrArray;
    }

    /**
     * @param num number to be written
     * @param type defines the number type: e.g. unsigned 16 B integer - uint16
     * @return bytearray of the number
     */
    writeTypedNumber(num, type, arrayLength, littleEndian) {
        let arrbuff = new ArrayBuffer(arrayLength);
        let view = new DataView(arrbuff);
        switch (type) {
            case 'uint16':
                view.setUint16(0, num, littleEndian);
                break;
            case 'uint32':
                view.setUint16(0, num, littleEndian);
                break;
            case 'int8':
                view.setInt8(0, num);
                break;
            case 'int16':
                view.setInt16(0, num, littleEndian);
                break;
            case 'int32':
                view.setInt32(0, num, littleEndian);
                break;
            case 'float':
                view.setFloat32(0, num, littleEndian);
                break;
            case 'double':
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
    concatBuffers(bufffer1, buffer2) {
        let concatedBuffer = new Uint8Array(bufffer1.length + buffer2.length);
        concatedBuffer.set(bufffer1);
        concatedBuffer.set(buffer2, bufffer1.length);
        return concatedBuffer;
    }

}

