export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url);
  const compressed = searchParams.get('compressed') === 'true';
  // Return image file (either compressed or original based on query param)
}
