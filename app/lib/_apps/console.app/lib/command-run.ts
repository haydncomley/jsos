import { Command } from "./types";

export const RUN: Command = async ({ filesystem, system }, path, command) => {
    const commandArgs = command.split(' ');
    const newPath = `${path}/${commandArgs[0]}`;
    const fileOrFolder = filesystem.get(newPath);

    if (!fileOrFolder) {
        return {
            line: `Could not find "${newPath}"`
        }
    }

    if (system.run(fileOrFolder)) {
        return {
            line: `Running "${newPath}"`
        }
    } else {
        return {
            line: `Could not run "${newPath}"`,
        }
    }
}