import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set(["i.ibb.co", "upload.wikimedia.org", "res.cloudinary.com"]);

const getContentType = (pathName: string, upstreamType: string | null) => {
  if (upstreamType?.startsWith("image/")) {
    return upstreamType;
  }

  const lower = pathName.toLowerCase();

  if (lower.endsWith(".svg")) return "image/svg+xml";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";

  return "image/png";
};

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url");

  if (!source) {
    return NextResponse.json({ message: "Missing logo URL" }, { status: 400 });
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(source);
  } catch {
    return NextResponse.json({ message: "Invalid logo URL" }, { status: 400 });
  }

  if (parsedUrl.protocol !== "https:" || !ALLOWED_HOSTS.has(parsedUrl.hostname)) {
    return NextResponse.json({ message: "Unsupported logo host" }, { status: 400 });
  }

  const upstream = await fetch(parsedUrl.toString(), {
    cache: "force-cache",
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ message: "Failed to fetch logo" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": getContentType(parsedUrl.pathname, upstream.headers.get("content-type")),
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
