import { ApplicationProps } from "~/lib/types";

import styles from './console.app.module.scss';

export const ConsoleApp = ({
    filesystem,
    preferences,
    system,
}: ApplicationProps) => {
    return (
        <div className={styles.consoleApp} data-window-drag>
            Console
        </div>
    );
}