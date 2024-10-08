/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useContext, useEffect, useMemo, useRef } from 'react';
import styles from './desktop-window.module.scss';
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
    const { windows, processes, activeWindowId, focusWindow, openProcess } = useContext(SystemSettingsContext)
    const fileSystemApi = useContext(FileSystemContext)
    const userPreferencesApi = useContext(UserPreferencesContext)
    const appWindow = windows.find(window => window.id === windowId)!;
    const windowRef = useRef<HTMLDivElement>(null);
    const { isDragging } = useOnDrag(windowRef, (left, top) => {
        windowRef.current!.style.left = `${left}px`;
        windowRef.current!.style.top = `${top}px`;
    })

    useEffect(() => {
        if (windowRef.current) {
            windowRef.current.style.left = `${appWindow.left}px`;
            windowRef.current.style.top = `${appWindow.top}px`;
            windowRef.current.style.width = `${appWindow.width}px`;
            windowRef.current.style.height = `${appWindow.height}px`;
        }

        let lastScreenWidth = window.innerWidth;

        const onResize = () => {
            if (!windowRef.current) return;
            console.log('resize');
            const delta = window.innerWidth - lastScreenWidth;
            windowRef.current.style.width = `${parseInt(windowRef.current.style.width) + delta}px`; 
            lastScreenWidth = window.innerWidth;
        }

        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        }
    }, [appWindow.left, appWindow.top, appWindow.width, appWindow.height])

    const renderWindowContent = useMemo(() => {
        const window = windows.find(window => window.id === windowId);
        if (!window) return null;
        const process = processes.find(process => process.id === window.processId);
        if (!process) return null;
        const Component = process.application.data;
        return (
            <Component 
                filesystem={fileSystemApi}
                preferences={userPreferencesApi}
                system={{
                    run: (item) => {
                        try {
                            if (IsFileSystemItemAnApplication(item)) {
                                openProcess(item.id, item)
                                return true
                            } else {
                                return false
                            }
                        } catch {
                            return false
                        }
                    }
                }}>
            </Component>
        );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [windows.length, processes.length, fileSystemApi, userPreferencesApi]);

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

                <span data-id="anchor-top-left" className={classNames(
                    styles.desktopWindowAnchor,
                    styles.desktopWindowAnchorTop,
                    styles.desktopWindowAnchorLeft
                )}/>

                <span data-id="anchor-top-right" className={classNames(
                    styles.desktopWindowAnchor,
                    styles.desktopWindowAnchorTop,
                    styles.desktopWindowAnchorRight
                )}/>

                <span data-id="anchor-bottom-right" className={classNames(
                    styles.desktopWindowAnchor,
                    styles.desktopWindowAnchorBottom,
                    styles.desktopWindowAnchorRight
                )}/>

                <span data-id="anchor-bottom-left" className={classNames(
                    styles.desktopWindowAnchor,
                    styles.desktopWindowAnchorBottom,
                    styles.desktopWindowAnchorLeft
                )}/>
            </div>
        </div>
    )
}