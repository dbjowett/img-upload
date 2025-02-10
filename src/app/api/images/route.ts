import { FILE_PATH } from '@/lib/constants';
import { ImageRes, Metadata, MimeType } from '@/lib/types';
import { createFileName } from '@/lib/utils';
import { existsSync, mkdirSync } from 'fs';
import { readdir, readFile, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join, default as path } from 'path';
import sharp from 'sharp';

const IMG_QUALITY = 50;

const getNextId = async (): Promise<number> => {
  const folders = await readdir(FILE_PATH);
  const folderIds = folders
    .map((id) => parseInt(id))
    .filter((id) => !isNaN(id))
    .sort();

  return folderIds.length ? folderIds[folderIds.length - 1] + 1 : 1;
};

const createDir = () => {
  if (!existsSync(FILE_PATH)) mkdirSync(FILE_PATH, { recursive: true });
};

const getBase64Images = async () => {
  const folderNameArr = await readdir(FILE_PATH); // ['1', '2' , '3', etc]

  const getImages = folderNameArr.map(async (path) => {
    const fileNameArr = await readdir(join(FILE_PATH, path));
    const itemMap = {} as ImageRes;

    // ** Return a promise which gets the files
    await Promise.all(
      fileNameArr.map(async (file) => {
        const filePath = join(FILE_PATH, path, file);
        if (file.includes('min-')) {
          const currentFile = await readFile(filePath, { encoding: 'base64' });
          itemMap.base64 = currentFile;
        } else if (file.includes('.json')) {
          const jsonFile = await readFile(filePath, { encoding: 'utf8' });
          const { createdAt, id, title } = JSON.parse(jsonFile) as Metadata;
          itemMap.createdAt = createdAt;
          itemMap.title = title;
          itemMap.id = id;
        } else {
          const currentFile = await readFile(filePath, { encoding: 'base64' });
          itemMap.base64 = currentFile;
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

  console.log('HERE');

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
    createdAt: Date.now(),
  };

  const folderPath = `${FILE_PATH}/${nextId}/`;
  const fileName = createFileName(title, image.type as MimeType);
  mkdirSync(folderPath, { recursive: true });

  const imageBuffer = Buffer.from(await image.arrayBuffer());

  try {
    // ** Minify and write to disc
    sharp(imageBuffer)
      .png({ compressionLevel: IMG_QUALITY / 10 })
      .jpeg({ quality: IMG_QUALITY })
      .webp({ quality: IMG_QUALITY })
      .toFile(`${folderPath}/min-${fileName}`);

    // ** Write original image to disc ** //
    await writeFile(path.join(process.cwd(), folderPath, fileName), imageBuffer);

    // ** Write metadata to disc ** //
    await writeFile(
      path.join(process.cwd(), folderPath, 'metadata.json'),
      JSON.stringify(metadata, null, 4)
    );

    return NextResponse.json({ Message: 'Successfully uploaded', status: 201 });
  } catch {
    return NextResponse.json({ error: 'Upload failed!' }, { status: 500 });
  }
}
