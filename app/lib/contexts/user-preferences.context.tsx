import { PropsWithChildren, createContext, useContext } from "react";
import { UserPreferencesAPI } from "../types";
import { FileSystemContext } from "./file-system.context";
import { IsFileSystemItemAFile, IsFileSystemItemAFolder, IsFileSystemItemAnApplication } from "../utils/helpers.utils";

export const UserPreferencesContext = createContext<UserPreferencesAPI>({
    desktop: {
        setBackgroundImage: () => null,
        applications: []
    }
});

export const UserPreferencesProvider = ({ children }: PropsWithChildren<object>) => {
    const { get, set } = useContext(FileSystemContext);
    const backgroundFileOrFolder = get('/root/session/desktop/wallpaper');
    const backgroundImage = IsFileSystemItemAFile(backgroundFileOrFolder) ? backgroundFileOrFolder : undefined
    
    const applicationsFileOrFolder = get('/root/system/applications');
    const applications = IsFileSystemItemAFolder(applicationsFileOrFolder) ? Object.values(applicationsFileOrFolder.data).filter(IsFileSystemItemAnApplication) : []

    return (
        <UserPreferencesContext.Provider value={{ 
           desktop: {
            applications,
            backgroundImage,
            setBackgroundImage: (file) => set('/root/session/desktop/wallpaper', {
                type: 'file',
                id: 'wallpaper',
                name: 'Current Wallpaper',
                icon: '',
                data: file.data,
                fileType: 'image',
            }),
           }
         }}>
            {children}
        </UserPreferencesContext.Provider>
    )
};