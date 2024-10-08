import { useContext, useEffect } from 'react';
import styles from './desktop-background.module.scss';
import { UserPreferencesContext } from '~/lib/contexts/user-preferences.context';
import { GetAccentFromImage } from '~/lib/utils/helpers.utils';

export const DesktopBackground = () => {
    const { desktop } = useContext(UserPreferencesContext);

    useEffect(() => {
        if (!desktop.backgroundImage?.data) return;
        GetAccentFromImage(desktop.backgroundImage.data).then(({ accent, contrast }) => {
            document.body.style.setProperty('--accent', accent)
            document.body.style.setProperty('--accent-contrast', contrast)
        })

    }, [desktop.backgroundImage?.data])

    return (
        <div className={styles.desktopBackground}>
            { desktop.backgroundImage ? (
                <img src={desktop.backgroundImage.data} alt="Desktop Background" />
            ) : null }
        </div>
    );
}