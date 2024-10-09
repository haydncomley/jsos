import { PropsWithChildren, createContext, useState } from "react";
import { Application, Process, Window } from "../types";
import { GetScreenBounds } from "../utils/helpers.utils";

interface SystemSettings {
    processes: Process[];
    openProcess: (application: Application, processId?: string, args?: string) => string;
    closeProcess: (processId: string) => void;
    windows: Window[];
    activeWindowId?: string;
    openWindow: (processId: string, args?: string) => void;
    closeWindow: (windowId: string) => void;
    maximizeWindow: (windowId: string) => void;
    focusWindow: (windowId?: string, args?: string) => void;
    setWindowSizeAndPosition: (windowId: string, left: number, top: number, width: number, height: number) => void;
    setWindowPosition: (windowId: string, left: number, top: number) => void;
    setWindowSize: (windowId: string, width: number, height: number) => void;
}

export const SystemSettingsContext = createContext<SystemSettings>({
    processes: [],
    windows: [],
    closeProcess: () => {},
    openProcess: () => '',
    closeWindow: () => {},
    openWindow: () => {},
    maximizeWindow: () => {},
    focusWindow: () => {},
    setWindowSizeAndPosition: () => {},
    setWindowPosition: () => {},
    setWindowSize: () => {},
});

const getFullscreenBounds = () => {
    const bounds = GetScreenBounds();
    const padding = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--theme-v-gap')) * 16;
    const top = (document.querySelector('[data-id="info-bar"]')?.getBoundingClientRect()?.bottom ?? 0) + padding;
    const bottom = document.querySelector('[data-id="launch-bar"]')?.getBoundingClientRect()?.top ?? bounds.height;

    return {
        left: padding,
        top: top,
        width: bounds.width - (padding * 2),
        height: bounds.height - top - (bounds.height - bottom) - padding,
    }
}

let zIndexCount = 0;

export const SystemSettingsProvider = ({ children }: PropsWithChildren<object>) => {
    const [ processes, setProcesses ] = useState<SystemSettings['processes']>([]);
    const [ windows, setWindows ] = useState<SystemSettings['windows']>([]);
    const [ activeWindowId, setActiveWindowId ] = useState<SystemSettings['activeWindowId']>();

    const openProcess = (application: Application, processId?: string, args?: string) => {
        const newProcessId = processId || (application.settings?.multiple ? `${Math.random()}` : application.id);
        const processExists = processes.find(process => process.id === newProcessId);
        if (processExists) {
            const windowExists = windows.find(window => window.processId === newProcessId);
            if (windowExists) {
                focusWindow(windowExists.id, args);
            } else {
                openWindow(newProcessId, args);
            }
            return processExists.id;
        }

        setProcesses((prev) => [
            ...prev,
            {
                id: newProcessId,
                application,
                args
            }
        ]);

        if (!application.settings?.headless) {
            openWindow(newProcessId, args);
        }

        return newProcessId;
    }

    const closeProcess = (processId: string) => {
        setProcesses((prev) => prev.filter(process => process.id !== processId));
        setWindows((prev) => prev.filter(window => window.processId !== processId));
        if (activeWindowId === processId) {
            setActiveWindowId(undefined);
        }
    }

    const openWindow = (processId: string, args?: string) => {
        const bounds = GetScreenBounds();
        const width = (bounds.height / 2) * 1.7;
        const height = (bounds.height / 2);

        setWindows((prev) => [
            ...prev,
            {
                id: processId,
                processId,
                width,
                height,
                left: bounds.width / 2 - width / 2,
                top: bounds.height / 2 - height / 2,
                zIndex: zIndexCount++,
                args,
            }
        ]);
        setActiveWindowId(processId);
    }

    const closeWindow = (windowId: string) => {
        setWindows((prev) => prev.filter(window => window.id !== windowId));
        if (activeWindowId === windowId) {
            setActiveWindowId(undefined);
        }
    }

    const maximizeWindow = (windowId: string) => {
        setWindows((prev) => prev.map(window => window.id === windowId ? {
            ...window,
            ...getFullscreenBounds(),
        } : window));
    }

    const focusWindow = (windowId?: string, args?: string) => {
        if (!windowId) {
            setActiveWindowId(undefined);
            return;
        }

        setActiveWindowId(windowId);
        setWindows((prev) => {
            const windowIndex = prev.findIndex((x) => x.id === windowId);
            prev[windowIndex].zIndex = ++zIndexCount;
            if(args) prev[windowIndex].args = args;
            return prev;
        });
    }

    const setWindowPosition = (windowId: string, left: number, top: number) => {
        setWindows((prev) => {
            const windowIndex = prev.findIndex((x) => x.id === windowId);
            prev[windowIndex].top = top;
            prev[windowIndex].left = left;
            return prev;
        });
    }

    const setWindowSize = (windowId: string, width: number, height: number) => {
        setWindows((prev) => {
            const windowIndex = prev.findIndex((x) => x.id === windowId);
            prev[windowIndex].height = height;
            prev[windowIndex].width = width;
            return prev;
        });
    }

    const setWindowSizeAndPosition = (windowId: string, left: number, top: number, width: number, height: number) => {
        setWindows((prev) => {
            const windowIndex = prev.findIndex((x) => x.id === windowId);
            prev[windowIndex].top = top;
            prev[windowIndex].left = left;
            prev[windowIndex].height = height;
            prev[windowIndex].width = width;
            return prev;
        });
    }

    
    return (
        <SystemSettingsContext.Provider value={{
            processes,
            windows,
            activeWindowId,
            openProcess,
            closeProcess,
            openWindow,
            closeWindow,
            maximizeWindow,
            focusWindow,
            setWindowPosition,
            setWindowSize,
            setWindowSizeAndPosition,
        }}>
            {children}
        </SystemSettingsContext.Provider>
    )
};