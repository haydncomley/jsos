import { ApplicationProps } from "~/lib/types";

import styles from './console.app.module.scss';
import { useRef, useState } from "react";
import { runCommand } from "./lib/_commands";
import classNames from "classnames";

// eslint-disable-next-line no-empty-pattern
export const ConsoleApp = (props: ApplicationProps) => {
    const logRef = useRef<HTMLDivElement>(null);
    const [ currentPath, setCurrentPath ] = useState('/root');
    const [ lines, setLines ] = useState<string[]>([]);
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

    const send = async () => {
        setCommandIndex(0)
        setLines([...lines, `$ ${command}`]);
        setCommands([...commands, command]);
        setIsCommandLoading(true);
        scrollDown();
        const { line, newPath } = await runCommand(props, currentPath, command);
        if (line) {
            setLines([...lines, line]);
        }
        if (newPath) setCurrentPath(newPath);
        setIsCommandLoading(false);
        setCommand('');
        scrollDown();
    }

    return (
        <div className={styles.consoleApp} data-window-drag>
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