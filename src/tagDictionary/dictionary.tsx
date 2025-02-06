import { standardDataElements } from "./standardDataElements.tsx";

/**
 * TagDictionary class
 * This class is used to look up the name of a DICOM tag
 */
export class TagDictionary {
  private dicomTagDictionary: { [key: string]: { vr: string; name: string } };

  /**
   * Constructor for the TagDictionary class
   * @constructor
   */
  constructor() {
    this.dicomTagDictionary = standardDataElements;
  }

  /**
   * lookup - Look up the name of a DICOM tag from its tag number
   * @param {string} tag
   * @returns {string} The name of the DICOM tag or Unknown if not found
   */
  lookup(tag: string): string {
    let tagName: string;
    try {
      tagName = this.dicomTagDictionary[tag.slice(1)].name;
    } catch {
      tagName = "Unknown";
    }

    return tagName;
  }
}
