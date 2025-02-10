import { FILE_PATH } from '@/lib/constants';
import { readdir, readFile, rm } from 'fs/promises';
import { NextResponse } from 'next/server';
import { join } from 'path';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id; // image id

  try {
    const folderNameArr = await readdir(FILE_PATH);

    if (!folderNameArr.includes(id)) throw new Error('This file does not exist');
    const fileNameArr = await readdir(join(FILE_PATH, id));
    const filtered = fileNameArr.find(
      (fileName) => !fileName.includes('.json') && !fileName.includes('min-')
    );
    if (!filtered) throw new Error('This file does not exist');

    const filePath = join(FILE_PATH, id, filtered);
    const currentFile = await readFile(filePath, { encoding: 'base64' });
    if (!currentFile) throw new Error('This file does not exist');
    return NextResponse.json(currentFile);
  } catch (error) {
    console.log('Error', error);
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id; // ** image id
  try {
    await rm(join(FILE_PATH, id), { recursive: true, force: true });
    return Response.json({ Message: 'Successfully uploaded', status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Please ensure all fields are valid' }, { status: 500 });
  }
}
