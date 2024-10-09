import { COWSAY } from "./command-cowsay";
import { CD } from "./command-cd";
import { LS } from "./command-ls";
import { Command } from "./types";
import { RUN } from "./command-run";

const COMMANDS: Record<string, Command> = {
    help: async () => {
        return {
            line: `Commands: ${Object.keys(COMMANDS).join(', ')}`
        }
    },
    cd: CD,
    ls: LS,
    run: RUN,
    cowsay: COWSAY,
}

export const runCommand: Command = async (apis, path, command) => {
    const commandSplit = command.split(' ');

    const commandName = commandSplit[0];
    const commandArgs = commandSplit.slice(1);

    if (COMMANDS[commandName]) {
        return await COMMANDS[commandName](apis, path, commandArgs.join(' '));
    }

    return {
        line: "Invalid Command - try \"help\" for a list of commands."
    };
}