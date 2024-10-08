/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { PropsWithChildren, useContext, useRef, useState } from "react";

import styles from './desktop-icon.module.scss';
import { FileSystemItem } from "~/lib/types";
import { AppIcon } from "~/lib/components/app-icon";
import classNames from "classnames";
import { SystemSettingsContext } from "~/lib/contexts/system-settings.context";
import { useOnDragIcon } from "~/lib/hooks/useOnDragIcon";
import { IsFileSystemItemAnApplication } from "~/lib/utils/helpers.utils";

interface DesktopIconProps extends PropsWithChildren {
    left?: number;
    top?: number;
    details: FileSystemItem;
    processId?: string;
}

export const DesktopIcon = ({ 
    left,
    top,
    details,
    processId,
 }: DesktopIconProps) => {
    const [placement, setPlacement] = useState<[number, number]>([left ?? 0, top ?? 0]);
    const { openProcess, activeWindowId, processes } = useContext(SystemSettingsContext);
    const iconRef = useRef<HTMLDivElement>(null);
    const { isDragging } = useOnDragIcon(iconRef, (left, top) => {
        const gridSize = 0.5 * 16;
        setPlacement([
            Math.max(Math.round(left / gridSize), 0),
            Math.max(Math.round(top / gridSize), 0),
        ]);
    });

    const isInDock = left === undefined;
    const isActive = activeWindowId === processId;
    const isOpen = !!processes.find(process => process.id === processId);

    const openFileSystemItem = () => {
        if (IsFileSystemItemAnApplication(details)) openProcess(details.id, details);
    }

    return (
        <div
            ref={iconRef}
            onMouseUp={() => {
                if (!isDragging) openFileSystemItem();
            }}
            className={classNames(
                styles.desktopIcon,
                {
                    [styles.isInDock]: isInDock,
                    [styles.isActive]: isActive,
                    [styles.isOpen]: isOpen,
                }
            )}
            style={{
                gridColumnStart: placement[0],
                gridRowStart: placement[1]
            }}>
            <AppIcon
                icon={details.icon}
                name={details.name}
                hideName={isInDock}
            ></AppIcon>
            { isInDock ? (
                <span className={styles.desktopIconStatus}></span>
            ) : null }
        </div>
    )
}