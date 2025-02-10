import { FILE_PATH } from '@/lib/constants';
// import { rmSync } from 'fs';
import { rm } from 'fs/promises';
import { NextResponse } from 'next/server';
import { join } from 'path';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id; // image id

  // Get full-sized image
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
