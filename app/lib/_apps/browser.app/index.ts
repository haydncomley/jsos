import { Application } from "~/lib/types";
import { BrowserApp } from "./browser.app";
import AppIcon from './icon.webp';

export const AppBrowser: Application = {
    type: 'application',
    id: 'app.browser',
    data: BrowserApp,
    icon: AppIcon,
    name: 'Browser',
}