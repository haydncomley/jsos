import { FileSystemItems } from "../types";
import { DEFAULT_APPS } from "./default-apps.data";
import { DEFAULT_ASSETS } from "./default-assets.data";

export const DEFAULT_SYSTEM: Record<string, FileSystemItems> = {
    "applications": {
        type: 'folder',
        id: 'applications',
        name: 'Applications',
        icon: '',
        data: DEFAULT_APPS,
    },
    "assets": {
        type: 'folder',
        id: 'assets',
        name: 'Assets',
        icon: '',
        data: DEFAULT_ASSETS,
    },
}