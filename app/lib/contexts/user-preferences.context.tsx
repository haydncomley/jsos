import { PropsWithChildren, createContext, useContext, useState } from "react";
import { UserPreferencesAPI } from "../types";
import { FileSystemContext } from "./file-system.context";
import { IsFileSystemItemAFolder, IsFileSystemItemAnApplication } from "../utils/helpers.utils";

export const UserPreferencesContext = createContext<UserPreferencesAPI>({
    desktop: {
        setBackgroundImage: () => null,
        applications: []
    }
});

export const UserPreferencesProvider = ({ children }: PropsWithChildren<object>) => {
    const { get } = useContext(FileSystemContext);
    const [ desktopBackgroundImage, setDesktopBackgroundImage ] = useState<string>('/root/system/assets/wallpaper-default');
    
    const applicationsFileOrFolder = get('/root/system/applications');
    const applications = IsFileSystemItemAFolder(applicationsFileOrFolder) ? Object.values(applicationsFileOrFolder.data).filter(IsFileSystemItemAnApplication) : []

    return (
        <UserPreferencesContext.Provider value={{ 
            desktop: {
                applications,
                backgroundImage: desktopBackgroundImage,
                setBackgroundImage: setDesktopBackgroundImage,
            }
         }}>
            {children}
        </UserPreferencesContext.Provider>
    )
};