import { mimeExtMap } from './constants';

export type MimeType = keyof typeof mimeExtMap;
export type ExtType = (typeof mimeExtMap)[MimeType];

export interface Metadata {
  id: number;
  title: string;
  originalTitle: string;
  size: number;
  createdAt: number;
}

export interface ImageAndMetadata extends Metadata {
  base64: string;
  fullBase64: string;
}
