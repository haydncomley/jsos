import { ConsoleApp } from "../_apps/console.app";
import { FilesApp } from "../_apps/files.app";
import { InfoApp } from "../_apps/info.app";
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
    },
    "app-console": {
        type: 'application',
        id: 'app-console',
        name: 'Console',
        icon: '/root/system/assets/icon-app-console',
        data: ConsoleApp,
    },
}