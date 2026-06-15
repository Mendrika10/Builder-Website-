import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

function guessMimeFromExt(name: string) {
  const ext = path.extname(name).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

const DEFAULT_PUBLIC = path.join(process.cwd(), "public");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename, data, contentType, size, siteId, collection } = body as {
      filename?: string;
      data?: string;
      contentType?: string;
      size?: number;
      siteId?: string;
      collection?: string;
    };

    if (!filename || !data) {
      return NextResponse.json(
        { error: "Missing filename or data" },
        { status: 400 },
      );
    }

    const uploadsDir = process.env.UPLOADS_DIR
      ? path.resolve(process.env.UPLOADS_DIR)
      : path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext =
      path.extname(filename) ||
      (contentType ? `.${contentType.split("/")[1]}` : ".png");
    const base = path
      .basename(filename, ext)
      .replace(/[^a-z0-9-_]/gi, "-")
      .toLowerCase();
    const uniqueName = `${base}-${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, uniqueName);

    const buffer = Buffer.from(data, "base64");
    await fs.writeFile(filePath, buffer);

    // Determine returned URL. If uploadsDir is under /public, return a static path.
    let url: string;
    if (filePath.startsWith(DEFAULT_PUBLIC)) {
      const rel = path
        .relative(DEFAULT_PUBLIC, filePath)
        .replace(/\\\\/g, "/")
        .replace(/\\/g, "/");
      url = `/${rel}`;
    } else {
      // Serve via API when stored outside public
      // The GET handler is mounted at /api/uploads, so return that path.
      url = `/api/uploads?name=${encodeURIComponent(uniqueName)}`;
    }

    // If requested, insert a record into the navigation image table
    try {
      if (collection === "navigation-img" && siteId) {
        await prisma.navigationImage.create({
          data: {
            idSite: siteId,
            filename: uniqueName,
            typeMime: contentType || guessMimeFromExt(uniqueName),
            url,
            size: Number(size) || buffer.length,
          },
        });
      }
    } catch (dbErr) {
      console.error("Prisma error storing navigation image:", dbErr);
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const name = url.searchParams.get("name") || url.searchParams.get("file");
    if (!name)
      return NextResponse.json({ error: "Missing name" }, { status: 400 });

    const uploadsDir = process.env.UPLOADS_DIR
      ? path.resolve(process.env.UPLOADS_DIR)
      : path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadsDir, name);
    const buffer = await fs.readFile(filePath);
    const mime = guessMimeFromExt(filePath);
    return new Response(buffer, { headers: { "Content-Type": mime } });
  } catch (err) {
    console.error("Serve upload error:", err);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
