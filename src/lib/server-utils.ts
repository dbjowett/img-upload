import { existsSync, mkdirSync } from 'fs';
import { readdir } from 'fs/promises';

import { FILE_PATH } from './constants';

// ** Gets next ID (TODO: Update this to fill in any blanks)
export async function getNextId(): Promise<number> {
  const folders = await readdir(FILE_PATH);
  const folderIds = folders
    .map((id) => parseInt(id))
    .filter((id) => !isNaN(id))
    .sort();

  return folderIds.length ? folderIds[folderIds.length - 1] + 1 : 1;
}

// ** Creates images directory if it doesn't exist
export function createDir() {
  if (!existsSync(FILE_PATH)) {
    mkdirSync(FILE_PATH, { recursive: true });
  }
}
