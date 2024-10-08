import { useContext } from 'react';
import styles from './app-icon.module.scss';
import { FileSystemContext } from '~/lib/contexts/file-system.context';
import { IsFileSystemItemAFile } from '~/lib/utils/helpers.utils';

interface AppIconProps {
    name: string;
    icon: string;
    hideName?: boolean;
}

export const AppIcon = ({
    icon,
    name,
    hideName,
}: AppIconProps) => {
    const { get } = useContext(FileSystemContext);
    const fileOrFolder = get(icon);
    const asset = IsFileSystemItemAFile(fileOrFolder) ? fileOrFolder : undefined;

    return (
        <div className={styles.appIcon}>
            <div className={styles.appIconImage}>
                <img src={asset?.data} alt={name} />
            </div>
            { !hideName ? (
                <p className={styles.appIconName}>
                    {name}
                </p>
            ) : null }
        </div>
    )
}