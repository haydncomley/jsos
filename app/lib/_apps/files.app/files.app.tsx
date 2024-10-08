import { useMemo, useState } from "react";
import { ApplicationProps, FileSystemItem } from "~/lib/types";
import { IsFileSystemItemAFile, IsFileSystemItemAFolder, IsFileSystemItemAnApplication, IsFileSystemItemAnImage } from "~/lib/utils/helpers.utils";

import styles from './files.app.module.scss';
import classNames from "classnames";

export const FilesApp = ({
    filesystem,
    preferences,
    system,
}: ApplicationProps) => {
    const [ isDraggingFileOver, setIsDraggingFileOver] = useState(false);
    const [ currentPath, setCurrentPath ] = useState('/root');
    const [ currentFile, setCurrentFile ] = useState<FileSystemItem>();

    const currentDirPaths = currentPath.split('/').filter(Boolean);
    const currentDirItems = useMemo(() => {
        const currentFolder = filesystem.get(currentPath);
        if (!currentFolder) return undefined;
        if (IsFileSystemItemAFile(currentFolder)) return [];
        return Object.values(currentFolder.data) as FileSystemItem[];
    }, [currentPath, filesystem])

    const doActionOnFile = (item: FileSystemItem) => {
        if (IsFileSystemItemAFolder(item)) {
            setCurrentPath(`${currentPath}/${item.id}`)
            setCurrentFile(undefined);
            return;
        }

        setCurrentFile(item);
    }

    return (
        <div
            className={classNames(
                styles.filesApp,
                {
                    [styles.isDraggingFileOver]: isDraggingFileOver
                }
            )}
            onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsDraggingFileOver(false);
                const file = e.dataTransfer.files[0];
                const name = file.name.replace(' ', '').slice(0, 25);
                const newFile = filesystem.upload(`${currentPath}/${name}`, file);
                setCurrentFile(newFile);
            }}
            onDragEnter={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsDraggingFileOver(true);
            }}
            onDragLeave={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsDraggingFileOver(false);
            }}
            onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
        >
            <div data-window-drag className={styles.filesAppRibbon}>
                <div className={styles.filesAppRibbonRoute}>
                    { currentDirPaths.map((pathSegment, index) => {
                        const folderInfo = filesystem.get(`/${currentDirPaths?.slice(0, index + 1).join('/')}`)
                        return (
                            <button
                                key={index + pathSegment} 
                                className={styles.filesAppRibbonRouteItem}
                                onClick={() => {
                                    setCurrentPath(`/${currentPath.split('/').filter(Boolean).slice(0, index + 1).join('/')}`)
                                    setCurrentFile(undefined);
                                }}>
                                {folderInfo?.name ?? pathSegment}
                            </button>
                        )
                    }) }
                </div>
            </div>
            <div className={styles.filesAppContent}>
                <div className={styles.filesAppContentList}>
                    { currentDirItems?.map((item) => {
                        const itemIconPath = item.icon || (IsFileSystemItemAFolder(item) ? '/root/system/assets/icon-folder' : '/root/system/assets/icon-file')
                        const icon = IsFileSystemItemAnImage(item) ? item : filesystem.get(itemIconPath);

                        return (
                            <button
                                key={item.id}
                                className={classNames(
                                    styles.filesAppContentItem,
                                    {
                                        [styles.isCurrentFile]: currentFile?.id === item.id,
                                    }
                                )}
                                title={item.name}
                                onClick={() => doActionOnFile(item)}>
                                <p className={styles.filesAppContentItemColWrap}>
                                    { icon?.data ? (
                                        <span className={classNames(
                                            styles.filesAppContentItemIcon,
                                            {
                                                [styles.isMask]: !item.icon
                                            }
                                        )}><img src={icon?.data as string} alt="Item Icon"></img></span>
                                    ) : null }
                                </p>
                                <p className={styles.filesAppContentItemCol}>
                                    {`${item.type === 'folder' ? '/ ' : ''}${item.name}`}
                                </p>
                                { !IsFileSystemItemAFolder(item) ? (
                                    <p className={styles.filesAppContentItemCol}>
                                    {IsFileSystemItemAFile(item) ? item.fileType : item.type}
                                </p>
                                ) : null }
                            </button>
                        )
                    }) }
                </div>
                { currentFile ? (
                    <div className={styles.filesAppContentPreview}>
                        <p>{ currentFile.name }</p>
                        <p>{ currentFile.id }</p>
                        { IsFileSystemItemAnImage(currentFile) ? (
                            <button onClick={() => {
                                preferences.desktop.setBackgroundImage(currentFile)
                            }}>Set as wallpaper</button>
                        ) : null }
                        { IsFileSystemItemAnApplication(currentFile) ? (
                            <button onClick={() => {
                                system.run(currentFile)
                            }}>Launch {currentFile.name} App</button>
                        ) : null }
                        <button onClick={() => {
                                filesystem.set(`/${currentDirPaths.join('/')}/${currentFile.id}`, undefined)
                            }}>Delete</button>
                    </div>
                ) : null }
            </div>

            <div className={styles.filesAppDragNotice}>
                <p>Drop File</p>
            </div>
        </div>
    );
}