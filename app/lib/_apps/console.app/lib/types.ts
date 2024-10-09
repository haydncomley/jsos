import { ApplicationProps } from "~/lib/types";

export type Command = (apis: ApplicationProps, path: string, command: string) => Promise<{
    line?: string;
    shouldClear?: boolean;
    newPath?: string;
}>