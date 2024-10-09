import { Command } from "./types";

export const ECHO: Command = async (apis, path, command) => {
    return {
        line: command
    }
}