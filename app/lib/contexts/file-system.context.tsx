import { PropsWithChildren, createContext, useState } from "react";
import { FileSystemFile, FileSystemAPI, FileSystemItems } from "../types";
import { GetFileAsFileItemType, IsFileSystemItemAFolder } from "../utils/helpers.utils";
import { DEFAULT_SESSION } from "../data/default-session.data";
import { DEFAULT_SYSTEM } from "../data/default-system.data";

export const FileSystemContext = createContext<FileSystemAPI>({
    root: {
        type: 'folder',
        id: 'root',
        name: '~',
        icon: '',
        data: {},
    },
    set: () => null,
    get:  () => undefined,
    exists:  () => false,
    upload:  () => undefined,
   operations: 0,
});

export const FileSystemProvider = ({ children }: PropsWithChildren<object>) => {
    const [ operations, setOperations ] = useState(0);
    const [ files, setFiles ] = useState<FileSystemAPI['root']>({
        type: 'folder',
        id: 'root',
        name: '~',
        icon: '',
        data: {
            system: {
                type: 'folder',
                id: 'system',
                name: 'System',
                icon: '',
                data: DEFAULT_SYSTEM,
            },
            session: {
                type: 'folder',
                id: 'session',
                name: 'Session',
                icon: '',
                data: DEFAULT_SESSION
            },
        },
    });

    const sanitisePath = (path: string) => {
        return path.split('/').filter(Boolean).join('/');

    }

    const get = (path: string, parent: FileSystemItems = {
        id: '~',
        name: '~',
        data: {
            root: files,
        },
        type: 'folder',
        icon: '',
    }) => {
        const pathSplit = sanitisePath(path).split('/').filter(Boolean);
        if (!pathSplit.length) return parent;

        if(!IsFileSystemItemAFolder(parent)) {
            return undefined;
        }

        if (pathSplit.length > 0 && parent.data[pathSplit[0]]) {
            return get(pathSplit.slice(1).join('/'), parent.data[pathSplit[0]]);
        }

        return undefined;
    }


    const exists = (path: string) => {
        try {
            return !!get(path);
        } catch {
            return false;
        }
    }

    const set = (path: string, data?: FileSystemItems) => {
        const pathSplit = path.split('/').filter(Boolean);
        const pathParent = get(`/${pathSplit.slice(0, -1).join('/')}`);
        
        if (!pathParent) return false;
        if (!IsFileSystemItemAFolder(pathParent)) return false;
        
        if (!data) {
            delete pathParent.data[pathSplit[pathSplit.length - 1]];
        } else {
            pathParent.data[pathSplit[pathSplit.length - 1]] = data;
        }

        setFiles(files);
        setOperations((prev) => prev + 1);
        return true;
    }

    const upload = (path: string, file: File) => {
        try {
            const pathSplit = path.split('/');
            const url = URL.createObjectURL(file);
            const newFile: FileSystemFile = {
                type: 'file',
                id: pathSplit[pathSplit.length - 1],
                name: file.name,
                icon: '',
                data: url,
                fileType: GetFileAsFileItemType(file),
            };
            set(path, newFile)
            setOperations((prev) => prev + 1);
            return newFile;
        } catch (e) {
            console.log('Error', e)
            return undefined;
        }
    }

    return (
        <FileSystemContext.Provider value={{ 
            root: files,
            set,
            get,
            exists,
            upload,
            operations,
         }}>
            {children}
        </FileSystemContext.Provider>
    )
};