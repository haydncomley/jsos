import { FileSystemItems } from "../types";

export const DEFAULT_ASSETS: Record<string, FileSystemItems> = {
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
    "icon-app-info": {
        type: 'file',
        id: 'icon-app-info',
        name: 'App Icon - info',
        icon: '',
        data: '/assets/icon-app-info.webp',
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
    "wallpaper-default": {
        type: 'file',
        id: 'wallpaper-default',
        name: 'Wallpaper Default',
        icon: '',
        data: '/assets/background-image-1.webp',
        fileType: 'image',
    }
}