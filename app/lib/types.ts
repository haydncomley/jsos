export interface FileSystemItem {
    id: string;
    name: string,
    icon: string;
    data: unknown;
    type: string;
}

export interface FileSystemFile extends FileSystemItem {
    type: 'file';
    fileType: 'image' | 'unknown';
    data: string;
}

export interface FileSystemFolder extends FileSystemItem {
    type: 'folder';
    data: Record<string, FileSystemItems>
}

export type FileSystemItems = FileSystemFile | FileSystemFolder | Application;

export interface FileSystemAPI {
    root: FileSystemFolder;
    set: (path: string, data?: FileSystemItems) => void;
    get: (path: string) => FileSystemItems | undefined,
    exists: (path: string) => boolean,
    upload: (path: string, file: File) => FileSystemFile | undefined,
    operations: number;
}

export interface UserPreferencesAPI {
    desktop: {
        backgroundImage?: string;
        setBackgroundImage: (file: string) => void;
        applications: Application[]
    }
}

export interface SystemAPI {
    run: (path: FileSystemItems) => boolean;
}

export interface ApplicationProps {
    filesystem: FileSystemAPI,
    preferences: UserPreferencesAPI,
    system: SystemAPI,
}

export interface Application extends FileSystemItem {
    type: 'application';
    data: (apis: ApplicationProps) => JSX.Element,
    settings?: {
        headless?: boolean,
        wrap?: boolean
    }
}

export interface Process {
    id: string,
    application: Application,
}

export interface Window {
    id: string;
    processId: string;
    left: number;
    top: number;
    width: number;
    height: number;
    zIndex: number;
}
