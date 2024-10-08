import styles from './desktop.module.scss';
import { DesktopBackground } from './lib/desktop-background';
import { DesktopGrid } from './lib/desktop-grid';
import { DesktopInfoBar } from './lib/desktop-info-bar';
import { DesktopLaunchBar } from './lib/desktop-launch-bar';

export const Desktop = () => {
    return (
        <div className={styles.desktop}>
            <DesktopBackground></DesktopBackground>
            <DesktopGrid></DesktopGrid>
            <DesktopLaunchBar></DesktopLaunchBar>
            <DesktopInfoBar></DesktopInfoBar>
        </div>
    );
}