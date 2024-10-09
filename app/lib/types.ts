export interface FileSystemItem {
    id: string;
    name: string,
    icon: string;
    data: unknown;
    type: string;
}

export interface FileSystemFile extends FileSystemItem {
    type: 'file';
    fileType: 'image' | 'video' | 'document' | 'script' | 'unknown';
    extension: string;
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
    download: (path: string) => void,
    exists: (path: string) => boolean,
    upload: (path: string, file: File) => FileSystemFile | undefined,
    operations: number;
}

export interface UserPreferencesAPI {
    desktop: {
        backgroundImage?: string;
        setBackgroundImage: (file: string) => void;
        applications: Application[];
        remove: (path: string) => void;
        add: (path: string) => void;
    }
}

export interface SystemAPI {
    run: (path: FileSystemItems, args?: string) => string | undefined;
    window: {
        getActive: () => Window | undefined;
    }
    process: {
        close: (processId: string) => void;
    },
    apps: {
        getConsole: () => Application | undefined;
        getViewer: () => Application | undefined;
        getEditor: () => Application | undefined;
    }
}

export interface ApplicationProps {
    process: Process,
    filesystem: FileSystemAPI,
    preferences: UserPreferencesAPI,
    system: SystemAPI,
    appArgs?: string,
}

export interface Application extends FileSystemItem {
    type: 'application';
    data: (apis: ApplicationProps) => JSX.Element,
    settings?: {
        headless?: boolean,
        wrap?: boolean
        multiple?: boolean;
    }
}

export interface Process {
    id: string,
    application: Application,
    args?: string;
}

export interface Window {
    id: string;
    processId: string;
    left: number;
    top: number;
    width: number;
    height: number;
    zIndex: number;
    args?: string;
}
