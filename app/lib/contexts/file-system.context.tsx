import { PropsWithChildren, createContext, useState } from "react";
import { FileSystemFile, FileSystemAPI, FileSystemItems } from "../types";
import { GetFileAsFileItemType, IsFileSystemItemAFolder } from "../utils/helpers.utils";
import { FilesApp } from "../_apps/files.app";
import { ConsoleApp } from "../_apps/console.app";

export const FileSystemContext = createContext<FileSystemAPI>({
   root: {
       type: 'folder',
        id: 'root',
        name: 'Root',
        data: {},
        icon: '',
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
                data: {
                    applications: {
                        type: 'folder',
                        id: 'applications',
                        name: 'Applications',
                        icon: '',
                        data: {
                            "app-files": {
                                type: 'application',
                                id: 'app-files',
                                name: 'Files',
                                icon: '/root/system/assets/icon-app-files',
                                data: FilesApp,
                            },
                            "app-console": {
                                type: 'application',
                                id: 'app-console',
                                name: 'Console',
                            icon: '/root/system/assets/icon-app-console',
                                data: ConsoleApp,
                            },
                        },
                    },
                    assets: {
                        type: 'folder',
                        id: 'assets',
                        name: 'Assets',
                        icon: '',
                        data: {
                            "icon-folder": {
                                type: 'file',
                                id: 'icon-folder',
                                name: 'Icon - Folder',
                                icon: '',
                                data: '/assets/icon-folder.webp',
                                fileType: 'image',
                            },
                            "icon-file": {
                                type: 'file',
                                id: 'icon-file',
                                name: 'Icon - File',
                                icon: '',
                                data: '/assets/icon-file.webp',
                                fileType: 'image',
                            },
                            "icon-app-files": {
                                type: 'file',
                                id: 'icon-app-files',
                                name: 'App Icon - Files',
                                icon: '',
                                data: '/assets/icon-app-files.webp',
                                fileType: 'image',
                            },
                            "icon-app-console": {
                                type: 'file',
                                id: 'icon-app-console',
                                name: 'App Icon - Console',
                                icon: '',
                                data: '/assets/icon-app-console.webp',
                                fileType: 'image',
                            },
                            "icon-app-web": {
                                type: 'file',
                                id: 'icon-app-web',
                                name: 'App Icon - Web',
                                icon: '',
                                data: '/assets/icon-app-web.webp',
                                fileType: 'image',
                            },
                        },
                    },
                },
            },
            session: {
                type: 'folder',
                id: 'session',
                name: 'Session',
                icon: '',
                data: {
                    desktop: {
                        type: 'folder',
                        id: 'desktop',
                        name: 'Desktop',
                        icon: '',
                        data: {
                           "wallpaper": {
                                type: 'file',
                                id: 'wallpaper',
                                name: 'Current Wallpaper',
                                icon: '',
                                data: '/assets/background-image-1.webp',
                                fileType: 'image',
                            },
                        },
                    },
                    pictures: {
                        type: 'folder',
                        id: 'pictures',
                        name: 'Pictures',
                        icon: '',
                        data: {
                            "wallpaper-red": {
                                type: 'file',
                                id: 'wallpaper-red',
                                name: 'Wallpaper Red',
                                icon: '',
                                data: '/assets/background-image-1.webp',
                                fileType: 'image',
                            },
                            "wallpaper-purple": {
                                type: 'file',
                                id: 'wallpaper-purple',
                                name: 'Wallpaper Purple',
                                icon: '',
                                data: '/assets/background-image-2.webp',
                                fileType: 'image',
                            },
                            "wallpaper-cloud": {
                                type: 'file',
                                id: 'wallpaper-cloud',
                                name: 'Wallpaper Cloud',
                                icon: '',
                                data: '/assets/background-image-3.webp',
                                fileType: 'image',
                            },
                        },
                    },
                },
            },
        },
    });

    const sanitisePath = (path: string) => {
        return path.split('/').filter(Boolean).join('/');

    }

    const get = (path: string, parent?: FileSystemItems) => {
        const pathSplit = sanitisePath(path).split('/').filter(Boolean);
        const currentRoot = parent ?? files;
        if (!pathSplit.length) return currentRoot;

        if(!IsFileSystemItemAFolder(currentRoot)) {
            return undefined;
        }

        if (pathSplit.length > 0) {
            return get(pathSplit.slice(1).join('/'), currentRoot.data[pathSplit[0]]);
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
// /test/something