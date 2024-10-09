import { Command } from "./types";

export const COWSAY: Command = async (apis, path, command) => {
    return {
        line: cowsay(command)   
    }
}

function cowsay(phrase: string): string {
    const bubbleWidth = Math.min(phrase.length, 50);
    const topBorder = " " + "_".repeat(bubbleWidth + 2);
    const bottomBorder = " " + "-".repeat(bubbleWidth + 2);

    const phraseLines = phrase.match(/.{1,50}/g) || [];
    const speechBubble = phraseLines
        .map(line => `< ${line.padEnd(bubbleWidth)} >`)
        .join("\n");

    const cow = `            \\   ^__^
            \\   (oo)\\_______
                (__)\\       )\\/\\
                    ||----w |
                    ||     ||`;

    return `${topBorder}\n${speechBubble}\n${bottomBorder}\n${cow}`
}