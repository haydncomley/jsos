import { FileSystemItems } from "../types";

export const DEFAULT_SESSION: Record<string, FileSystemItems> = {
    "pictures": {
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
    }
}