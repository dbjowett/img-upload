import { NextResponse } from 'next/server';

const blogs = [
  {
    id: '1',
    author: 'Mark',
    content: 'blog 1 content is here',
  },
  {
    id: '2',
    author: 'Mohamed',
    content: 'blog 2 content is here',
  },
  {
    id: '3',
    author: 'Amine',
    content: 'blog 3 content is here',
  },
];

export async function GET() {
  return NextResponse.json(blogs);
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const image = formData.get('image');
  const title = formData.get('title');
  return Response.json({ image, title });
}
