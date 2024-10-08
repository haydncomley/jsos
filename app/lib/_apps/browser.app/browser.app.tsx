import { useState } from "react";

import styles from './browser.app.module.scss';

export const BrowserApp = () => {
    const [url, setUrl] = useState('https://www.haydncomley.com');

    return (
        <div className={styles.browserApp}>
            <iframe src={url} title="Browser App"></iframe>
        </div>
    )
}