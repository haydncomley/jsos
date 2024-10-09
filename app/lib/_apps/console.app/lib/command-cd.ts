import { IsFileSystemItemAFolder } from "~/lib/utils/helpers.utils";
import { Command } from "./types";

export const CD: Command = async ({ filesystem }, path, command) => {
    const commandArgs = command.split(' ');
    const wantedPath = commandArgs[0].trim();
    const currentRoute = filesystem.get(path);

    if(!IsFileSystemItemAFolder(currentRoute)) {
        return {
            line: `Invalid current directory "${path}"`
        }
    }

    if (!command) {
        return {
            line: path
        }
    }

    let newPath = path;

    if (wantedPath === '../') {
        newPath = path.slice(0, path.lastIndexOf('/'));
    } else if(wantedPath === '/') {
        newPath = '/root';
    } 
    else {
        newPath = wantedPath.startsWith('/') ?  wantedPath : (path + '/' + wantedPath);
    }

    const newRoute = filesystem.get(newPath);

    if(IsFileSystemItemAFolder(newRoute)) {
        return {
            newPath:newPath
        }
    }
    
    return {
        line: `Invalid directory "${newPath}"`
    }
}