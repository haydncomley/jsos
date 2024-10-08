import { ApplicationProps } from "~/lib/types";

import styles from './info.app.module.scss';
import { name, version, author } from '../../../../package.json';

// eslint-disable-next-line no-empty-pattern
export const InfoApp = ({}: ApplicationProps) => {
    return (
        <div className={styles.infoApp} data-window-drag>
            <h1 className={styles.infoAppTitle}>{name}</h1>
            <p className={styles.infoAppVersion}>{version}</p>

            <p className={styles.infoAppCredit}>
                <small className={styles.infoAppLabel}>Made By</small>
                {author.name}
            </p>
        </div>
    );
}