import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { auth } from '@/lib/auth';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(req) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided.' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const uploadedUrls = [];

    for (const file of files) {
      if (typeof file === 'string') continue;

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type}. Use JPG, PNG, WebP, or AVIF.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds the 5MB limit.` },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || '.jpg';
      const baseName = path
        .basename(file.name, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 30);

      const uniqueFilename = `${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}-${baseName}${ext}`;
      const filePath = path.join(uploadDir, uniqueFilename);

      await writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/${uniqueFilename}`);
    }

    return NextResponse.json({ urls: uploadedUrls }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 });
  }
}