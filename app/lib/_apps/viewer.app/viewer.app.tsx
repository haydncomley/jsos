import { ApplicationProps } from "~/lib/types";

import styles from './viewer.app.module.scss';
import { IsFileSystemItemAnImage, IsFileSystemItemAnPieceOfMedia } from "~/lib/utils/helpers.utils";
import { useArgs } from "~/lib/hooks/useArgs";

export const ViewerApp = ({ filesystem, preferences, appArgs }: ApplicationProps) => {
    const { args } = useArgs(appArgs);
    const filePath = args?.[0];
    const fileOrFolder = filePath ? filesystem.get(filePath) : undefined;
    const image = IsFileSystemItemAnPieceOfMedia(fileOrFolder) ? fileOrFolder : undefined;

    // Should we automatically close if an invalid path is given?
    // Maybe open a dialog that tells the user something went wrong instead?
    //
    // if (!image) {
    //     const currentWindow = system.window.getActive();
    //     if (currentWindow) system.process.close(currentWindow.processId);
    // }

    return (
        <div className={styles.viewerApp}>
            <button data-window-bar data-window-drag></button>
            { image ? (
                <div className={styles.viewerAppContent}>
                    <div className={styles.viewerAppContentMedia}>
                        { IsFileSystemItemAnImage(image) ? (
                            <img src={image.data} alt={image.name} />
                        ) : null }
                    </div>

                    <div className={styles.viewerAppContentActions}>
                        { (IsFileSystemItemAnImage(image) && filePath) ? (
                            <>
                                <button
                                    data-button="primary"
                                    onClick={() => {
                                        preferences.desktop.setBackgroundImage(filePath)
                                    }}>
                                    Set as Wallpaper
                                </button>
                                <button
                                    data-button="primary"
                                    onClick={() => {
                                        filesystem.download(filePath)
                                    }}>
                                    Download
                                </button>
                            </>
                        ) : null }
                    </div>
                </div>
            ) : (
                <div className={styles.viewerAppContent}>
                    <p>No Asset</p>
                </div>
            ) }
        </div>
    );
}