/**
 * Tags to be anonymized data type
 * @description - Interface for Tag to be anonymized
 * @interface tagIdAnon
 * @type {tagIdAnon}
 * @returns {tagIdAnon}
 */
interface tagIdAnon {
    tagId: string;
    name: string;
    value: string;
}

/**
 * Test Tags to be anonymized
 * @description - Test Tag to be anonymized
 * @type {tagIdAnon[]}
 * @returns {tagIdAnon[]}
 */
export const Test_TagsAnon: tagIdAnon[] = [
    { tagId: "X00100010", name: "PatientName", value: "ANONYMOUS" },
];

/**
 * Tags to be anonymized
 * @description - Tags to be anonymized
 * @type {tagIdAnon[]}
 * @returns {tagIdAnon[]}
 */
export const TagsAnon: tagIdAnon[] = [
    { tagId: "X00080050", name: "Accession Number", value: "AC0000" },
    { tagId: "X00080080", name: "Institution Name", value: "ANONYMOUS" },
    { tagId: "X00080081", name: "Institution Address", value: "ANONYMOUS" },
    {
        tagId: "X00080090",
        name: "Referring Physician Name",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00080092",
        name: "Referring Physician's Address",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00080094",
        name: "Referring Physician's Telephone Numbers",
        value: "ANONYMOUS",
    },
    {
        tagId: "X0008009C",
        name: "Consulting Physician's Name",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00081050",
        name: "Performing Physician Name",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00081060",
        name: "Name Of Physicians Reading Study",
        value: "ANONYMOUS",
    },
    { tagId: "X00081070", name: "Operators Name", value: "ANONYMOUS" },
    { tagId: "X00100010", name: "Patient Name", value: "ANONYMOUS" },
    { tagId: "X00100020", name: "Patient ID", value: "MR0000" },
    { tagId: "X00100030", name: "Patient Birth Date", value: "19000101" },
    {
        tagId: "X00100033",
        name: "Patient's Birth Date in Alternative Calendar",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00100034",
        name: "Patient's Death Date in Alternative Calendar",
        value: "ANONYMOUS",
    },
    {
        tagId: "X001021B0",
        name: "Additional Patient History",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00102154",
        name: "Patient's Telephone Numbers",
        value: "ANONYMOUS",
    },
    { tagId: "X00101000", name: "Other Patient IDs", value: "ANONYMOUS" },
    { tagId: "X00101001", name: "Other Patient Names", value: "ANONYMOUS" },
    { tagId: "X00101005", name: "Patient's Birth Name", value: "ANONYMOUS" },
    { tagId: "X00101040", name: "Patient's Address", value: "ANONYMOUS" },
    {
        tagId: "X00101060",
        name: "Patient's Mother's Birth Name",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00102154",
        name: "Patient's Telephone Numbers",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00120010",
        name: "Clinical Trial Sponsor Name",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00120031",
        name: "Clinical Trial Site Name",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00120060",
        name: "Clinical Trial Coordinating Center Name",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00120081",
        name: "Clinical Trial Protocol Ethics Committee Name",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00120082",
        name: "Clinical Trial Protocol Ethics Committee Approval Number",
        value: "ANONYMOUS",
    },
    { tagId: "X00140104", name: "Secondary Reviewer Name", value: "ANONYMOUS" },
    { tagId: "X00142006", name: "Evaluator Name", value: "ANONYMOUS" },
    { tagId: "X00321032", name: "Requesting Physician", value: "ANONYMOUS" },
    {
        tagId: "X00400006",
        name: "Scheduled Performing Physician's Name",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00401010",
        name: "Names of Intended Recipients of Results",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00401103",
        name: "Person's Telephone Numbers",
        value: "ANONYMOUS",
    },
    {
        tagId: "X00402010",
        name: "Order Callback Phone Number",
        value: "ANONYMOUS",
    },
    { tagId: "X00700084", name: "Content Creator's Name", value: "ANONYMOUS" },
];
