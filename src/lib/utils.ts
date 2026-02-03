import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1000));

  // Convert to the appropriate unit
  const value = bytes / Math.pow(1000, i);

  // Use toPrecision(3) to keep exactly 3 significant digits
  // This handles "round if more" (1234 -> 1.23k) and "add fractions if less" (1.2 -> 1.20k)
  // Note: for very small numbers (e.g. 10 Bytes), 10.0 might be desired or just 10.
  // The user said "if it has less add fractions", implying 12 -> 12.0.
  const formattedValue = value.toPrecision(3);

  return `${formattedValue} ${sizes[i]}`;
};

export const linkToProject = (proj: any) => {
  return `https://learn.reboot01.com/intra/bahrain/bh-module/${proj.path.trim().split('/').pop()}`;
}