import { Command } from "./types";

export const EXIT: Command = async ({ system, process }) => {
    system.process.close(process.id)

    return {
        line: "Closing..." 
    }
}