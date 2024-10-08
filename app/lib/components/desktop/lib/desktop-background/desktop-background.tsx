import { useContext, useEffect } from 'react';
import styles from './desktop-background.module.scss';
import { UserPreferencesContext } from '~/lib/contexts/user-preferences.context';
import { GetAccentFromImage, IsFileSystemItemAnImage } from '~/lib/utils/helpers.utils';
import { FileSystemContext } from '~/lib/contexts/file-system.context';

export const DesktopBackground = () => {
    const { get } = useContext(FileSystemContext);
    const { desktop } = useContext(UserPreferencesContext);
    const backgroundFile =  desktop.backgroundImage ? get(desktop.backgroundImage) : undefined;
    const backgroundFileUrl = IsFileSystemItemAnImage(backgroundFile) ? backgroundFile.data : undefined;

    useEffect(() => {
        if (!backgroundFileUrl) return;
        GetAccentFromImage(backgroundFileUrl).then(({ accent, contrast }) => {
            document.body.style.setProperty('--accent', accent)
            document.body.style.setProperty('--accent-contrast', contrast)
        })

    }, [backgroundFileUrl])

    return (
        <div className={styles.desktopBackground}>
            { backgroundFileUrl ? (
                <img src={backgroundFileUrl} alt="Desktop Background" />
            ) : null }
        </div>
    );
}