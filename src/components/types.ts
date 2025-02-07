export interface DicomTag {
    tagName: string;
    value: string | DicomTag[];
}

export interface DicomTableProps {
    dicomData: { [key: string]: DicomTag };
}

export interface File {
    name: string;
}

export interface SidebarProps {
    files: File[];
    onFileSelect: (index: number) => void;
    currentFileIndex: number;
}

export interface AppState {
    files: File[];
    dicomData: any[];
    currentFileIndex: number;
}
