import { IsFileSystemItemAFolder } from "~/lib/utils/helpers.utils";
import { Command } from "./types";

export const LS: Command = async ({ filesystem }, path, command) => {
    console.log(command);
    const currentRoute = filesystem.get(command || path);

    if(!IsFileSystemItemAFolder(currentRoute)) {
        return {
            line: `Invalid current directory "${path}"`
        }
    }

    return {
        line: Object.values(currentRoute.data).map((item) => `${item.type === 'folder' ? '/' : ''}${item.id}`).join(' ')   
    }
}