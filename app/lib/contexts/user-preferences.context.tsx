import { PropsWithChildren, createContext, useContext, useMemo, useState } from "react";
import { Application, UserPreferencesAPI } from "../types";
import { FileSystemContext } from "./file-system.context";
import { IsFileSystemItemAnApplication } from "../utils/helpers.utils";

export const UserPreferencesContext = createContext<UserPreferencesAPI>({
    desktop: {
        setBackgroundImage: () => null,
        applications: [],
        remove: () => null,
        add: () => null,
    }
});

export const UserPreferencesProvider = ({ children }: PropsWithChildren<object>) => {
    const { get } = useContext(FileSystemContext);
    const [ desktopBackgroundImage, setDesktopBackgroundImage ] = useState<string>('/root/system/assets/wallpaper-default');
    const [ desktopApplicationPaths, setDesktopApplicationPaths ] = useState<string[]>([
        '/root/system/applications/app-info',
        '/root/system/applications/app-files',
        '/root/system/applications/app-console',
        '/root/system/applications/app-editor',
    ]);

    const desktopApplications = useMemo(() => {
        const apps = desktopApplicationPaths.map((x) => {
            const fileOrFolder = get(x);
            return IsFileSystemItemAnApplication(fileOrFolder) ? fileOrFolder : undefined
        }).filter(Boolean); 
        return apps as Application[]
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desktopApplicationPaths.join(',')])

    const removeAppFromDesktop = (path: string) => setDesktopApplicationPaths(desktopApplicationPaths.filter((x) => x !== path))
    const addAppToDesktop = (path: string) => {
        if (desktopApplicationPaths.includes(path)) return;
        const fileOrFolder = get(path);
        if (!IsFileSystemItemAnApplication(fileOrFolder)) return;
        setDesktopApplicationPaths([...desktopApplicationPaths, path])
    }
    
    return (
        <UserPreferencesContext.Provider value={{ 
            desktop: {
                applications: desktopApplications,
                backgroundImage: desktopBackgroundImage,
                setBackgroundImage: setDesktopBackgroundImage,
                add: addAppToDesktop,
                remove: removeAppFromDesktop,
            }
         }}>
            {children}
        </UserPreferencesContext.Provider>
    )
};