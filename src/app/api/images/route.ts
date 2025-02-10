import { FILE_PATH } from '@/lib/constants';
import { createDir, getNextId } from '@/lib/server-utils';
import { ImageAndMetadata, Metadata, MimeType } from '@/lib/types';
import { createFileName } from '@/lib/utils';
import { mkdirSync } from 'fs';
import { readdir, readFile, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join, default as path } from 'path';
import sharp from 'sharp';

const IMG_QUALITY = 20;

// ** Fetches Metadata and Minified image
const getBase64Images = async () => {
  const folderNameArr = await readdir(FILE_PATH); // ['1', '2' , '3', etc]

  const getImages = folderNameArr.map(async (path) => {
    const fileNameArr = await readdir(join(FILE_PATH, path));
    const itemMap = {} as ImageAndMetadata;

    // ** Return a promise which gets the files
    await Promise.all(
      fileNameArr.map(async (file) => {
        const filePath = join(FILE_PATH, path, file);
        if (file.includes('min-')) {
          const currentFile = await readFile(filePath, { encoding: 'base64' });
          itemMap.base64 = currentFile;
        } else if (file.includes('.json')) {
          const jsonFile = await readFile(filePath, { encoding: 'utf8' });
          const jsonFields = JSON.parse(jsonFile) as Metadata; // metadata object
          Object.assign(itemMap, jsonFields);
        } else {
          const currentFile = await readFile(filePath, { encoding: 'base64' });
          itemMap.fullBase64 = currentFile;
        }
      })
    );
    return itemMap;
  });
  return Promise.all(getImages);
};

export async function GET() {
  createDir();
  return NextResponse.json({ images: await getBase64Images() });
}

export async function POST(req: NextRequest) {
  // ** Make dir if doesn't exist
  createDir();

  const formData = await req.formData();
  const image = formData.get('image') as File;
  const title = formData.get('title') as string;

  // ** Correct Mime type && title
  if (!image.type.startsWith('image/') || !image || !title) {
    return NextResponse.json({ error: 'Please ensure all fields are valid' }, { status: 500 });
  }

  const nextId = await getNextId();

  const metadata: Metadata = {
    id: nextId,
    title: title,
    originalTitle: image.name,
    size: image.size,
    createdAt: Date.now(),
  };

  const folderPath = `${FILE_PATH}/${nextId}/`;
  const fileName = createFileName(title, image.type as MimeType);
  mkdirSync(folderPath, { recursive: true });

  const imageBuffer = Buffer.from(await image.arrayBuffer());

  try {
    // ** Minify and write to disk
    sharp(imageBuffer)
      .png({ compressionLevel: IMG_QUALITY / 10 })
      .jpeg({ quality: IMG_QUALITY })
      .webp({ quality: IMG_QUALITY })
      .toFile(`${folderPath}/min-${fileName}`);

    // ** Write original image to disk ** //
    await writeFile(path.join(process.cwd(), folderPath, fileName), imageBuffer);

    // ** Write metadata to disk ** //
    await writeFile(
      path.join(process.cwd(), folderPath, 'metadata.json'),
      JSON.stringify(metadata, null, 4)
    );

    // ** Fix race condition with file being fetched before written to disk
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });

    return NextResponse.json({ Message: 'Successfully uploaded', status: 201 });
  } catch {
    return NextResponse.json({ error: 'Upload failed!' }, { status: 500 });
  }
}
