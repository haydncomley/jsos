import { IsFileSystemItemAScript } from "~/lib/utils/helpers.utils";
import { Command } from "./types";

export const RUN: Command = async ({ filesystem, system }, path, command) => {
    const console = system.apps.getConsole();
    const commandArgs = command.split(' ');
    const newPath = commandArgs[0].startsWith('/') ? commandArgs[0] : `${path}/${commandArgs[0]}`;
    const fileOrFolder = filesystem.get(newPath);

    if (!fileOrFolder) {
        return {
            line: `Could not find "${newPath}"`
        }
    }

    if (IsFileSystemItemAScript(fileOrFolder) && console) {
        system.run(console, `${fileOrFolder.data}\n--run\n--quit`);

        return {
            line: `Running Script "${fileOrFolder.name}"`
        }
    }

    if (system.run(fileOrFolder, commandArgs.slice(1).join(" "))) {
        return {
            line: `Running "${fileOrFolder.name}"`
        }
    } else {
        return {
            line: `Could not run "${fileOrFolder.name}"`,
        }
    }
}