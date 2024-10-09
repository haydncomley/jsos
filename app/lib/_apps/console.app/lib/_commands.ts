import { COWSAY } from "./command-cowsay";
import { CD } from "./command-cd";
import { LS } from "./command-ls";
import { Command } from "./types";
import { RUN } from "./command-run";
import { EXIT } from "./command-exit";
import { ECHO } from "./command-echo";
import { SLEEP } from "./command-sleep";

const COMMANDS: Record<string, Command> = {
    help: async () => {
        return {
            line: `Commands: \n${Object.keys(COMMANDS).map((command) => `- ${command}`).join('\n')}`
        }
    },
    clear: async () => ({ shouldClear: true }),
    echo: ECHO,
    cd: CD,
    ls: LS,
    exit: EXIT,
    run: RUN,
    sleep: SLEEP,
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