import styles from './desktop-launch-bar.module.scss'
import { useContext } from 'react'
import { SystemSettingsContext } from '~/lib/contexts/system-settings.context'
import { DesktopIcon } from '../desktop-icon'
import classNames from 'classnames'

export const DesktopLaunchBar = () => {
    const { processes } = useContext(SystemSettingsContext)

    return (
        <div
            data-id="launch-bar"
            className={classNames(
                styles.desktopLaunchBar,
                {
                    [styles.isHidden]: !processes.length
                }
            )}>
            <div className={styles.desktopLaunchBarItems}>
                {
                    [...processes].map((process) => (
                        <DesktopIcon
                            key={process.application.name}
                            processId={process.application.id}
                            details={process.application}>
                        </DesktopIcon>
                    ))
                }
            </div>
        </div>
    )
}