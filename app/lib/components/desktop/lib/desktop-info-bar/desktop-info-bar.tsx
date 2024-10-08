import { useContext, useEffect, useState } from 'react';
import styles from './desktop-info-bar.module.scss';
import { DateTime } from 'luxon';
import { SystemSettingsContext } from '~/lib/contexts/system-settings.context';

const getCurrentDate = () => {
    return DateTime.now().toFormat('EEE d MMM HH:mm');
}

export const DesktopInfoBar = () => {
    const { activeWindowId, closeProcess, maximizeWindow, windows, processes } = useContext(SystemSettingsContext)
    const activeWindow = windows.find(window => window.id === activeWindowId);
    const [ date, setDate ] = useState('');

    useEffect(() => {
        setDate(getCurrentDate());
        const interval = setInterval(() => {
            setDate(getCurrentDate());
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [])

    return (
        <div data-id="info-bar" className={styles.desktopInfoBar}>
            <div className={styles.desktopInfoBarItems}>
                

                { (activeWindow && activeWindowId) ? (
                    <>
                        <p className={styles.desktopInfoBarItemTime}> 
                            {processes.find(process => process.id === activeWindow.processId)?.application.name}
                        </p>

                        <p className={styles.desktopInfoBarItemTime}> 
                            •
                        </p>
                    </>
                ) : null }

                <p className={styles.desktopInfoBarItemTime}> 
                    {date}
                </p>

                { (activeWindow && activeWindowId) ? (
                    <>
                         <p className={styles.desktopInfoBarItemTime}> 
                            •
                        </p>

                        <div className={styles.desktopInfoBarItemActions}>
                            <button className={styles.desktopInfoBarItemActionFullscreen} onClick={() => maximizeWindow(activeWindowId)}></button>
                            <button className={styles.desktopInfoBarItemActionClose} onClick={() => closeProcess(activeWindow.processId)}></button>
                        </div>
                    </>
                ) : null }
            </div>
        </div>
    )
}