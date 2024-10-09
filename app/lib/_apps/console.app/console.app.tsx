import { ApplicationProps } from "~/lib/types";

import styles from './console.app.module.scss';
import { useEffect, useRef, useState } from "react";
import { runCommand } from "./lib/_commands";
import classNames from "classnames";
import { useArgs } from "~/lib/hooks/useArgs";

export const ConsoleApp = (props: ApplicationProps) => {
    const { args } = useArgs(props.appArgs);
    const logRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const mounted = useRef(false);
    const [ currentPath, setCurrentPath ] = useState('/root');
    // This is an anti-pattern - but it allows a console.app to be opened and commands to be iterated though when changing paths.
    let executingPath = currentPath;
    const [ lines, setLines ] = useState<string[]>(args.length ? [] : ['Hey there! Type "help" for a list of commands']);
    const [ commands, setCommands ] = useState<string[]>([]);
    const [ commandIndex, setCommandIndex ] = useState(0);
    const [ command, setCommand ] = useState('');
    const [ isCommandLoading, setIsCommandLoading ] = useState(false);

    const scrollDown = () => {
        requestAnimationFrame(() => {
            logRef.current?.scrollTo({
                top: logRef.current?.scrollHeight,
                behavior: 'smooth'
            })
        })
    }

    const sendCommand = async (wantedCommand: string) => {
        setCommandIndex(0)
        setLines((prev) => [...prev, `$ ${wantedCommand}`]);
        setCommands((prev) => [...prev, wantedCommand]);
        setIsCommandLoading(true);
        scrollDown();
        const { line, newPath, shouldClear } = await runCommand(props, executingPath, wantedCommand.trim());
        if(newPath) executingPath = newPath ;
        if (shouldClear) {
            setLines([]);
        }
        if (line) {
            setLines((prev) => [...prev, line]);
        }
        if (newPath) setCurrentPath(newPath);
        setIsCommandLoading(false);
        scrollDown();
    }

    const send = async () => {
        await sendCommand(command);
        setCommand('');
    }

    useEffect(() => {
        if (!inputRef.current) return;
        inputRef.current.focus();

    },[!inputRef.current])

    useEffect(() => {
        if (mounted.current || !args.length) return;
        mounted.current = true;
        
        const doCommands = async () => {
            if (!args.length) return;
            for (let i = 0; i < args.length; i++) {
                await sendCommand(args[i])
            }
        }

        doCommands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className={styles.consoleApp}>
            <button data-window-bar data-window-drag></button>
            <div ref={logRef} className={styles.consoleAppLog}>
                { lines.map((line, index) => (
                    <p key={index}>{line}</p>
                )) }
            </div>

            <div className={classNames(
                styles.consoleAppInput,
                { [styles.loading]: isCommandLoading }
            )}>
                <p>
                    {currentPath}
                </p>
                <input
                    ref={inputRef}
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)} 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') send();
                        if (e.key === 'ArrowUp') {
                            const index = commandIndex + 1;
                            if (index > commands.length) return;
                            setCommandIndex(index);
                            setCommand(commands[commands.length - index]);
                        }
                        if (e.key === 'ArrowDown') {
                            const index = commandIndex - 1;
                            if (index < 1) {
                                setCommandIndex(0);
                                return setCommand('');
                            }
                            setCommandIndex(index);
                            setCommand(commands[commands.length - index]);
                        }
                    }}/>
            </div>
        </div>
    );
}