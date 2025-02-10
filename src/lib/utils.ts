import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { mimeExtMap } from './constants';
import { MimeType } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function openLinkInNewTab(url: string) {
  window.open(url, '_blank')!.focus();
}

// ** Takes an image mime type, returns an extension ('image/jpeg' -> '.jpeg')
export function mimeToExtension(mimeType: MimeType) {
  return mimeExtMap[mimeType];
}

// ** Receives image title (ex: `Image Title`) and returns file name (ex: `Image_Title.jpg`)
export function createFileName(title: string, mime: MimeType) {
  return `${title.replaceAll(' ', '_')}${mimeToExtension(mime)}`;
}
