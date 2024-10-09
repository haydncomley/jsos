import { useMemo, useState } from "react";
import { Application, ApplicationProps, FileSystemItem } from "~/lib/types";
import { IsFileSystemItemAFile, IsFileSystemItemAFolder, IsFileSystemItemAnApplication, IsFileSystemItemAnImage, IsFileSystemItemAScript } from "~/lib/utils/helpers.utils";

import styles from './files.app.module.scss';
import classNames from "classnames";
import { AppIcon } from "~/lib/components/app-icon";
import { useArgs } from "~/lib/hooks/useArgs";

export const FilesApp = ({
    filesystem,
    preferences,
    system,
    appArgs,
}: ApplicationProps) => {
    const { args } = useArgs(appArgs);
    const [ isDraggingFileOver, setIsDraggingFileOver] = useState(false);
    const wantedPath = args?.[0] || '/root';
    const wantedDir = filesystem.get(wantedPath)
    const console = system.apps.getConsole();
    const viewer = system.apps.getViewer();
    const editor = system.apps.getEditor();

    const [ currentPath, setCurrentPath ] = useState(IsFileSystemItemAFolder(wantedDir) ? wantedPath : '/root');
    const [ currentFile, setCurrentFile ] = useState<FileSystemItem>();

    const currentDirPaths = currentPath.split('/').filter(Boolean);
    const currentDirItems = useMemo(() => {
        const currentFolder = filesystem.get(currentPath);
        if (!currentFolder) return undefined;
        if (IsFileSystemItemAFile(currentFolder)) return [];
        return Object.values(currentFolder.data) as FileSystemItem[];
    }, [currentPath, filesystem])

    const getFilePath = (item: FileSystemItem) => {
        return `${currentPath}/${item.id}`
    }

    const doActionOnFile = (item: FileSystemItem) => {
        if (IsFileSystemItemAFolder(item)) {
            setCurrentPath(getFilePath(item))
            setCurrentFile(undefined);
            return;
        }

        setCurrentFile(item);
    }

    const isOnDesktop = (app: Application) => {
        return preferences.desktop.applications.find((x) => x.id === app.id);
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

                { console ? (
                    <button className={styles.filesAppRibbonConsole} onClick={() => {
                        system.run(console, `cd ${currentPath}`)
                    }}>
                        <AppIcon icon={console.icon} name={console.name} hideName></AppIcon>
                    </button>
                ) : null }
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
                        <div className={styles.filesAppContentPreviewHeader}>
                            <span className={styles.filesAppContentPreviewHeaderImage}>
                                { IsFileSystemItemAnImage(currentFile) ? (
                                    <img src={currentFile.data} alt={currentFile.name}></img>
                                ) : (
                                    <img src={filesystem.get(currentFile.icon || '/root/system/assets/icon-file')?.data as string} alt={currentFile.name}></img>
                                ) }
                            </span>
                            <div className={styles.filesAppContentPreviewHeaderInfo}>
                                <p>
                                    { currentFile.name }
                                    <small>{ `${currentFile.id}${IsFileSystemItemAFile(currentFile) ? `.${currentFile.extension}` : ''}` }</small>
                                </p>
                            </div>
                        </div>

                        { (IsFileSystemItemAnApplication(currentFile) && console) ? (
                            <div className={styles.filesAppContentPreviewActions}>
                                    <button
                                        data-button="primary"
                                        onClick={() => {
                                            system.run(console, `run ${getFilePath(currentFile)}\nexit`)
                                        }}>
                                        Open
                                    </button>
                                    <button
                                        data-button="primary"
                                        onClick={() => {
                                            if (isOnDesktop(currentFile)) {
                                                preferences.desktop.remove(`/root/system/applications/${currentFile.id}`)
                                            } else {
                                                preferences.desktop.add(`/root/system/applications/${currentFile.id}`)
                                            }
                                        }}>
                                        { isOnDesktop(currentFile) ? 'Remove from Desktop' : 'Add to Desktop'  }
                                    </button>
                            </div>
                        ) : null }

                        { IsFileSystemItemAnImage(currentFile) ? (
                            <div className={styles.filesAppContentPreviewActions}>
                                { viewer ? (
                                <button
                                    data-button="primary"
                                    onClick={() => {
                                        system.run(viewer, getFilePath(currentFile))
                                    }}>
                                    Open
                                </button>
                                ) : null }
                                { IsFileSystemItemAnImage(currentFile) ? (
                                    <button
                                        data-button="primary"
                                        onClick={() => {
                                            preferences.desktop.setBackgroundImage(getFilePath(currentFile))
                                        }}>
                                        Set Wallpaper
                                    </button>
                                ) : null }
                            </div>
                        ) : null }

                        { (IsFileSystemItemAScript(currentFile) && editor && console) ? (
                            <div className={styles.filesAppContentPreviewActions}>
                                <button
                                    data-button="primary"
                                    onClick={() => {
                                        system.run(editor, currentFile.data)
                                    }}>
                                    Open
                                </button>
                                <button
                                    data-button="primary"
                                    onClick={() => {
                                        system.run(console, `run ${getFilePath(currentFile)}\nexit`)
                                    }}>
                                    Run
                                </button>
                            </div>
                        ) : null }

                        <div className={styles.filesAppContentPreviewActions}>
                            <button 
                                data-button="primary"
                                onClick={() => {
                                    filesystem.download(getFilePath(currentFile))
                                }}>
                                Download
                            </button>
                            <button 
                                data-button="primary"
                                onClick={() => {
                                    filesystem.set(getFilePath(currentFile), undefined)
                                }}>
                                Delete
                            </button>
                        </div>
                    </div>
                ) : null }
            </div>

            <div className={styles.filesAppDragNotice}>
                <p>Drop File</p>
            </div>
        </div>
    );
}