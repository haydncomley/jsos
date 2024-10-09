import { ApplicationProps } from "~/lib/types";

import styles from './editor.app.module.scss';
import { useEffect, useRef, useState } from "react";
import { useArgs } from "~/lib/hooks/useArgs";

export const EditorApp = ({ system, appArgs, process, filesystem }: ApplicationProps) => {
    const mounted = useRef(false);
    const { args, flags } = useArgs(appArgs?.replaceAll(',', '\n'));
    const [ value, setValue ] = useState(args.join('\n'));
    const consoleApp = system.apps.getConsole();

    const run = async () => {
        const commands = value.trim().split('\n').filter(Boolean);
        if (!consoleApp || !commands.length) return;
        system.run(consoleApp, commands.join('\n'));
    }

    const save = () => {
        filesystem.set('/root/session/script', {
            type: 'file',
            fileType: 'script',
            data: value,
            icon: '',
            id: 'script',
            name: 'My Script',
            extension: 'jsoss'
        })
    }

    useEffect(() => {
        if (mounted.current) return;
        mounted.current = true;
        if (flags.includes('run')) run();
        if (flags.includes('quit')) system.process.close(process.id)
    }, flags)

    return (
        <div className={styles.editorApp}>
            <button data-window-bar data-window-drag></button>

            <div  className={styles.editorAppContent}>
                <textarea value={value} onChange={(e) => setValue(e.target.value)}></textarea>
            </div>

            <div  className={styles.editorAppActions}>
                <button
                    data-button="primary"
                    onClick={save}>
                    Save
                </button>
                <button
                    data-button="primary"
                    onClick={run}>
                    Run
                </button>
            </div>
        </div>
    );
}