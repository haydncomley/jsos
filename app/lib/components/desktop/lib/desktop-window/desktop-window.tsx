/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext, useEffect, useMemo, useRef } from 'react';
import styles from './desktop-window.module.scss';
import { useOnDragWindow } from './lib/useOnDragWindow';
import { useOnDrag } from '~/lib/hooks/useOnDrag';
import classNames from 'classnames';
import { SystemSettingsContext } from '~/lib/contexts/system-settings.context';
import { FileSystemContext } from '~/lib/contexts/file-system.context';
import { UserPreferencesContext } from '~/lib/contexts/user-preferences.context';
import { IsFileSystemItemAnApplication } from '~/lib/utils/helpers.utils';

interface DesktopWindowProps {
    windowId: string;
}

export const DesktopWindow = ({
    windowId
}: DesktopWindowProps) => {
    const {
        windows,
        processes,
        activeWindowId,
        focusWindow,
        openProcess,
        setWindowPosition,
        setWindowSizeAndPosition,
        closeProcess,
    } = useContext(SystemSettingsContext)
    const fileSystemApi = useContext(FileSystemContext)
    const userPreferencesApi = useContext(UserPreferencesContext)

    const appWindow = windows.find(window => window.id === windowId)!;
    const process = processes.find(process => process.id === appWindow.processId)!;

    const windowRef = useRef<HTMLDivElement>(null);
    const windowCornerTopLeftRef = useRef<HTMLDivElement>(null);
    const windowCornerTopRightRef = useRef<HTMLDivElement>(null);
    const windowCornerBottomRightRef = useRef<HTMLDivElement>(null);
    const windowCornerBottomLeftRef = useRef<HTMLDivElement>(null);

    const { isDragging } = useOnDragWindow(windowRef, (left, top) => {
        windowRef.current!.style.left = `${left}px`;
        windowRef.current!.style.top = `${top}px`;
        setWindowPosition(appWindow.id, left, top);
    })

    const savePos = () => {
        if (!windowRef.current) return;
        const left = parseInt(windowRef.current.style.left);
        const top = parseInt(windowRef.current.style.top);
        const width = parseInt(windowRef.current.style.width);
        const height = parseInt(windowRef.current.style.height);
        setWindowSizeAndPosition(appWindow.id, left, top, width, height);
    }

    useOnDrag(windowCornerTopLeftRef, (l,t,left, top) => {
        if (!windowRef.current) return;
        windowRef.current.style.top = `${parseInt(windowRef.current.style.top) - top}px`;
        windowRef.current.style.left = `${parseInt(windowRef.current.style.left) - left}px`;
        windowRef.current.style.width = `${parseInt(windowRef.current.style.width) + left}px`;
        windowRef.current.style.height = `${parseInt(windowRef.current.style.height) + top}px`;
    }, savePos);

    useOnDrag(windowCornerTopRightRef, (l,t,left, top) => {
        if (!windowRef.current) return;
        windowRef.current.style.top = `${parseInt(windowRef.current.style.top) - top}px`;
        windowRef.current.style.width = `${parseInt(windowRef.current.style.width) - left}px`;
        windowRef.current.style.height = `${parseInt(windowRef.current.style.height) + top}px`;
    }, savePos);

    useOnDrag(windowCornerBottomRightRef, (l,t,left, top) => {
        if (!windowRef.current) return;
        windowRef.current.style.width = `${parseInt(windowRef.current.style.width) - left}px`;
        windowRef.current.style.height = `${parseInt(windowRef.current.style.height) - top}px`;
    }, savePos);

    useOnDrag(windowCornerBottomLeftRef, (l,t,left, top) => {
        if (!windowRef.current) return;
        windowRef.current.style.left = `${parseInt(windowRef.current.style.left) - left}px`;
        windowRef.current.style.width = `${parseInt(windowRef.current.style.width) + left}px`;
        windowRef.current.style.height = `${parseInt(windowRef.current.style.height) - top}px`;
    }, savePos);

    useEffect(() => {
        if (!windowRef.current) return
        windowRef.current.style.zIndex = `${appWindow.zIndex}`;
            
        if (!process?.application.settings?.wrap) {
            windowRef.current.style.left = `${appWindow.left}px`;
            windowRef.current.style.top = `${appWindow.top}px`;
            windowRef.current.style.width = `${appWindow.width}px`;
            windowRef.current.style.height = `${appWindow.height}px`;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appWindow.left, appWindow.top, appWindow.width, appWindow.height, appWindow.zIndex])

    const renderWindowContent = useMemo(() => {
        if (!process) return null;
        const Component = process.application.data;
        return (
            <Component 
                process={process}
                filesystem={fileSystemApi}
                preferences={userPreferencesApi}
                appArgs={process.args}
                system={{
                    run: (item, args) => {
                        try {
                            if (IsFileSystemItemAnApplication(item)) {
                                return openProcess(item, undefined, args)
                            } else {
                                return
                            }
                        } catch {
                            return
                        }
                    },
                    window: {
                        getActive: () => windows.find((x) => x.id === activeWindowId)
                    },
                    process: {
                        close: (processId) => closeProcess(processId),
                    },
                    apps: {
                        getConsole: () => {
                            const fileOrFolder = fileSystemApi.get('/root/system/applications/app-console');
                            return IsFileSystemItemAnApplication(fileOrFolder) ? fileOrFolder : undefined;
                        },
                        getViewer: () => {
                            const fileOrFolder = fileSystemApi.get('/root/system/applications/app-viewer');
                            return IsFileSystemItemAnApplication(fileOrFolder) ? fileOrFolder : undefined;
                        },
                        getEditor: () => {
                            const fileOrFolder = fileSystemApi.get('/root/system/applications/app-editor');
                            return IsFileSystemItemAnApplication(fileOrFolder) ? fileOrFolder : undefined;
                        },
                    }
                }}>
            </Component>
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [windows.length, processes.length, fileSystemApi, userPreferencesApi, activeWindowId]);

    return (
        <div
            ref={windowRef}
            className={classNames(
                styles.desktopWindowWrapper,
                {
                    [styles.isDragging]: isDragging,
                    [styles.isActive]: activeWindowId === windowId
                } 
            )}
            onMouseDown={() => {
                    focusWindow(windowId);
            }}>
            <div className={styles.desktopWindow}>
                <div className={styles.desktopWindowContent}>
                    {renderWindowContent}
                </div>

                { !process.application.settings?.wrap ? (
                    <>
                        <span ref={windowCornerTopLeftRef} className={classNames(
                            styles.desktopWindowAnchor,
                            styles.desktopWindowAnchorTop,
                            styles.desktopWindowAnchorLeft
                        )}/>

                        <span ref={windowCornerTopRightRef} className={classNames(
                            styles.desktopWindowAnchor,
                            styles.desktopWindowAnchorTop,
                            styles.desktopWindowAnchorRight
                        )}/>

                        <span ref={windowCornerBottomRightRef} className={classNames(
                            styles.desktopWindowAnchor,
                            styles.desktopWindowAnchorBottom,
                            styles.desktopWindowAnchorRight
                        )}/>

                        <span ref={windowCornerBottomLeftRef} className={classNames(
                            styles.desktopWindowAnchor,
                            styles.desktopWindowAnchorBottom,
                            styles.desktopWindowAnchorLeft
                        )}/>
                    </>
                ) : null }
            </div>
        </div>
    )
}