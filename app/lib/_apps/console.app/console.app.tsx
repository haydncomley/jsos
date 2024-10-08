import { ApplicationProps } from "~/lib/types";

import styles from './console.app.module.scss';

// eslint-disable-next-line no-empty-pattern
export const ConsoleApp = ({}: ApplicationProps) => {
    return (
        <div className={styles.consoleApp} data-window-drag>
            Console Hello World
        </div>
    );
}