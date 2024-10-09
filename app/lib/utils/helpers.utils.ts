import { Application, FileSystemFile, FileSystemItem, FileSystemFolder } from "../types"

export const GetScreenBounds = () => {
    return {
        width: window.innerWidth,
        height: window.innerHeight
    }
}

export function IsFileSystemItemAnApplication(item?: FileSystemItem): item is Application {
    return item?.type === 'application';
} 

export function IsFileSystemItemAFile(item?: FileSystemItem): item is FileSystemFile {
    return item?.type === 'file';
} 

export function IsFileSystemItemAFolder(item?: FileSystemItem): item is FileSystemFolder {
    return item?.type === 'folder';
}

export function IsFileSystemItemAScript(item?: FileSystemItem): item is FileSystemFile & { fileType: 'script' } {
  if (!IsFileSystemItemAFile(item)) return false;
  return item?.fileType === 'script';
}

export function IsFileSystemItemADocument(item?: FileSystemItem): item is FileSystemFile & { fileType: 'document' } {
  if (!IsFileSystemItemAFile(item)) return false;
  return item?.fileType === 'document';
}

export function IsFileSystemItemAnImage(item?: FileSystemItem): item is FileSystemFile & { fileType: 'image' } {
  if (!IsFileSystemItemAFile(item)) return false;
  return item?.fileType === 'image';
}

export function IsFileSystemItemAVideo(item?: FileSystemItem): item is FileSystemFile & { fileType: 'video' } {
  if (!IsFileSystemItemAFile(item)) return false;
  return item?.fileType === 'video';
}

export function IsFileSystemItemAnPieceOfMedia(item?: FileSystemItem): item is FileSystemFile & { fileType: 'image' | 'video' } {
  if (!IsFileSystemItemAFile(item)) return false;
  return IsFileSystemItemAnImage(item) || IsFileSystemItemAVideo(item);
}

export const GetFileAsFileItemType = (file: File): FileSystemFile['fileType'] => {
  const extension = file.name.slice(file.name.lastIndexOf('.') + 1);
  if (['webp', 'jpg', 'jpeg', 'png', 'avif'].includes(extension)) {
    return 'image';
  }

  return 'unknown';
}
  
export const GetAccentFromImage = async (imageUrl: string): Promise<{
    accent: string;
    contrast: string;
  }> => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    return new Promise((resolve, reject) => {
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            if (!context) {
            return reject("Could not get canvas context.");
            }

            canvas.width = img.width;
            canvas.height = img.height;

            context.drawImage(img, 0, 0, img.width, img.height);

            const imageData = context.getImageData(0, 0, img.width, img.height).data;
            const [r, g, b] = getDominantColor(imageData);
            const accentColor = rgbToHex(r, g, b);
            const contrastColor = getContrastColor(r, g, b);

            resolve({ accent: accentColor, contrast: contrastColor });
        };

        img.onerror = (err) => {
            reject(`Image loading error: ${err}`);
        };
    });
};
  
// Helper function to calculate the dominant color
  const getDominantColor = (imageData: Uint8ClampedArray): [number, number, number] => {
  const colorMap = new Map<string, number>();

  for (let i = 0; i < imageData.length; i += 4) {
    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    // Skip colors that are too close to black or white
    const brightness = (r + g + b) / 3;
    if (brightness < 30 || brightness > 225) {
      continue; // Skip near-black or near-white colors
    }

    const key = `${r},${g},${b}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }

  // If we didn't find a valid accent color, we fallback to mid-tone grayish color
  if (colorMap.size === 0) {
    return [128, 128, 128]; // Fallback mid-tone color
  }

  // Find the most frequent color
  let dominantColor: [number, number, number] = [0, 0, 0];
  let maxCount = 0;

  colorMap.forEach((count, color) => {
    if (count > maxCount) {
      dominantColor = color.split(",").map(Number) as [number, number, number];
      maxCount = count;
    }
  });

  return dominantColor;
};

// Helper function to convert RGB to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};

// Helper function to get contrast color (black or white)
const getContrastColor = (r: number, g: number, b: number): string => {
  // Calculate luminance using the standard formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // Return black or white based on contrast
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};