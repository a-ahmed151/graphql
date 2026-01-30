import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatBytes = (bytes:number, decimals = 0) => {
    if (bytes === 0) return '0 Bytes';

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    // Calculate the correct unit index using logarithms
    const i = Math.floor(Math.log(bytes) / Math.log(1000));

    // Format the value to the specified number of decimals and append the unit
    return `${parseFloat((bytes / Math.pow(1000, i)).toFixed(decimals))} ${sizes[i]}`;
};