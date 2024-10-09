/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import styles from './desktop-grid.module.scss';
import { DesktopWindow } from '../desktop-window';
import { useContext } from 'react';
import { SystemSettingsContext } from '~/lib/contexts/system-settings.context';
import { DesktopIcon } from '../desktop-icon';
import { UserPreferencesContext } from '~/lib/contexts/user-preferences.context';

export const DesktopGrid = () => {
    const { desktop } = useContext(UserPreferencesContext)
    const { windows, focusWindow } = useContext(SystemSettingsContext)
    
    return (
        <div className={styles.desktopGrid}>
            <div className={styles.desktopGridBackplate} onClick={() => focusWindow()}></div>
            {
                desktop.applications.map((application, index) => (
                    <DesktopIcon
                        key={index}
                        top={2}
                        left={2 + (index * 10)}
                        details={application}>
                    </DesktopIcon>
                ))
            }

            {windows.map((window) => (
                <DesktopWindow key={window.id} windowId={window.id} />
            ))}
        </div>
    )
}