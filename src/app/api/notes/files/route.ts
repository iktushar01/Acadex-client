import { NextRequest, NextResponse } from "next/server";

const isAllowedFileHost = (url: URL) =>
  url.protocol === "https:" && url.hostname.endsWith("cloudinary.com");

const getContentTypeFromFileName = (fileName: string) => {
  const lower = fileName.toLowerCase();

  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";

  return null;
};

const withResourceType = (url: string, resourceType: "image" | "raw") =>
  url.replace(/\/(image|raw)\/upload\//, `/${resourceType}/upload/`);

const collapseDuplicateFolderSegments = (assetPath: string) =>
  assetPath
    .replace(/^(Acadex\/pdfs)\/\1\//, "$1/")
    .replace(/^(Acadex\/images)\/\1\//, "$1/");

const getDedupedUrl = (url: URL) => {
  const match = url.pathname.match(/(\/upload\/(?:v\d+\/)?)(.+)$/);

  if (!match) {
    return null;
  }

  const [, prefix, assetPath] = match;
  const collapsedAssetPath = collapseDuplicateFolderSegments(assetPath);

  if (collapsedAssetPath !== assetPath) {
    const deduped = new URL(url.toString());
    deduped.pathname = `${prefix}${collapsedAssetPath}`;
    return deduped.toString();
  }

  const parts = assetPath.split("/");

  if (parts.length % 2 !== 0) {
    return null;
  }

  const half = parts.length / 2;
  const firstHalf = parts.slice(0, half).join("/");
  const secondHalf = parts.slice(half).join("/");

  if (firstHalf !== secondHalf) {
    return null;
  }

  const deduped = new URL(url.toString());
  deduped.pathname = `${prefix}${secondHalf}`;
  return deduped.toString();
};

const getCandidateUrls = (url: URL, fileName: string) => {
  const candidates = [url.toString()];
  const isPdf = fileName.toLowerCase().endsWith(".pdf");
  const dedupedUrl = getDedupedUrl(url);

  if (dedupedUrl) {
    candidates.push(dedupedUrl);
  }

  if (isPdf) {
    candidates.push(withResourceType(url.toString(), "raw"));
    candidates.push(withResourceType(url.toString(), "image"));

    if (dedupedUrl) {
      candidates.push(withResourceType(dedupedUrl, "raw"));
      candidates.push(withResourceType(dedupedUrl, "image"));
    }
  }

  return [...new Set(candidates)];
};

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url");
  const fileName = request.nextUrl.searchParams.get("fileName") ?? "attachment";
  const download = request.nextUrl.searchParams.get("download") === "1";

  if (!source) {
    return NextResponse.json({ message: "Missing file URL" }, { status: 400 });
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(source);
  } catch {
    return NextResponse.json({ message: "Invalid file URL" }, { status: 400 });
  }

  if (!isAllowedFileHost(parsedUrl)) {
    return NextResponse.json({ message: "Unsupported file host" }, { status: 400 });
  }

  let upstream: Response | null = null;

  for (const candidateUrl of getCandidateUrls(parsedUrl, fileName)) {
    const response = await fetch(candidateUrl, {
      cache: "no-store",
    });

    if (response.ok && response.body) {
      upstream = response;
      break;
    }
  }

  if (!upstream?.ok || !upstream.body) {
    return NextResponse.json({ message: "Failed to fetch file" }, { status: 502 });
  }

  const headers = new Headers();
  const upstreamType = upstream.headers.get("content-type");
  const inferredType = getContentTypeFromFileName(fileName);
  const contentType =
    upstreamType && upstreamType !== "application/octet-stream"
      ? upstreamType
      : inferredType;
  const contentLength = upstream.headers.get("content-length");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  headers.set(
    "Content-Disposition",
    `${download ? "attachment" : "inline"}; filename="${encodeURIComponent(fileName)}"`
  );

  return new NextResponse(upstream.body, {
    status: 200,
    headers,
  });
}
