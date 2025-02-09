import { FILE_PATH } from '@/lib/constants';
import { MimeType } from '@/lib/types';
import { createFileName } from '@/lib/utils';
import { existsSync, mkdirSync, readdir } from 'fs';
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

const IMG_QUALITY = 50;

interface Metadata {
  id: number;
  title: string;
  createdAt: number;
}

const getNextId = (): Promise<number> =>
  new Promise((resolve) => {
    readdir(FILE_PATH, (err, files) => {
      resolve(files?.length + 1);
    });
  });

export async function GET() {
  // Check, else return all
  // const searchParams = req.nextUrl.searchParams;
  // const id = searchParams.get('id');

  // const files = [];

  return NextResponse.json({ Ping: 'pong' });
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const image = formData.get('image') as File;
  const title = formData.get('title') as string;

  // ** Correct Mime type
  if (!image.type.startsWith('image/') || !image || !title) {
    return NextResponse.json({ error: 'Please ensure all fields are valid' }, { status: 500 });
  }

  // ** Make dir if doesn't exist
  if (!existsSync(FILE_PATH)) mkdirSync(FILE_PATH, { recursive: true });
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

    return Response.json({ Message: 'Successfully uploaded', status: 201 });
  } catch {
    return NextResponse.json({ error: 'Upload failed!' }, { status: 500 });
  }
}
