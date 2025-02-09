import { mimeExtMap } from './constants';

export type MimeType = keyof typeof mimeExtMap;
export type ExtType = (typeof mimeExtMap)[MimeType];
