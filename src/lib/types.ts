import { mimeExtMap } from './constants';

export type MimeType = keyof typeof mimeExtMap;
export type ExtType = (typeof mimeExtMap)[MimeType];

export interface Metadata {
  id: number;
  title: string;
  createdAt: number;
}

export interface ImageRes extends Metadata {
  base64: string;
}
