import { Command } from "./types";

export const SLEEP: Command = (apis, path, command) => {
    return new Promise((res) => {
        setTimeout(() => {
            res({})
        }, parseInt(command || '1000'));
    })
}