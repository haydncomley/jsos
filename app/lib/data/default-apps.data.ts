import { ConsoleApp } from "../_apps/console.app";
import { FilesApp } from "../_apps/files.app";
import { InfoApp } from "../_apps/info.app";
import { EditorApp } from "../_apps/editor.app";
import { ViewerApp } from "../_apps/viewer.app";
import { Application } from "../types";

export const DEFAULT_APPS: Record<string, Application> = {
    "app-info": {
        type: 'application',
        id: 'app-info',
        name: 'Info',
        icon: '/root/system/assets/icon-app-info',
        data: InfoApp,
        settings: {
            wrap: true,
        }
    },
    "app-files": {
        type: 'application',
        id: 'app-files',
        name: 'Files',
        icon: '/root/system/assets/icon-app-files',
        data: FilesApp,
        settings: {
            multiple: true
        }
    },
    "app-console": {
        type: 'application',
        id: 'app-console',
        name: 'Console',
        icon: '/root/system/assets/icon-app-console',
        data: ConsoleApp,
        settings: {
            multiple: true
        }
    },
    "app-viewer": {
        type: 'application',
        id: 'app-viewer',
        name: 'Viewer',
        icon: '/root/system/assets/icon-app-viewer',
        data: ViewerApp,
        settings: {
            multiple: true
        }
    },
    "app-editor": {
        type: 'application',
        id: 'app-editor',
        name: 'Editor',
        icon: '/root/system/assets/icon-app-editor',
        data: EditorApp,
        settings: {
            multiple: true
        }
    },
}