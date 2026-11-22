import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: { slug: string[] } };

function backendPath(slug: string[]) {
  const path = slug.join("/").replace(/^\/+|\/+$/g, "");
  if (path.startsWith("v1/")) return `/api/${path}`;

  const aliases: Record<string, string> = {
    "peer-matcher/me": "peer-matcher/my-pair",
    "opportunities": "opportunities/events",
    "study-plan": "study-plan",
    "dashboard/overview": "dashboard/overview",
  };
  return `/api/${aliases[path] ?? path}`;
}

async function proxy(req: NextRequest, { params }: RouteContext) {
  const baseUrl = process.env.BACKEND_API_URL?.trim().replace(/\/+$/, "");
  if (!baseUrl) {
    return NextResponse.json(
      { success: false, error: "backend_not_configured", message: "The CAMPUS-NEXUS API is not configured for this deployment." },
      { status: 503 },
    );
  }

  const target = new URL(`${baseUrl}${backendPath(params.slug || [])}`);
  req.nextUrl.searchParams.forEach((value, key) => target.searchParams.append(key, value));

  const headers = new Headers();
  for (const name of ["authorization", "content-type", "accept", "x-request-id"]) {
    const value = req.headers.get(name);
    if (value) headers.set(name, value);
  }

  try {
    const response = await fetch(target, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer(),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    const responseHeaders = new Headers();
    const contentType = response.headers.get("content-type");
    if (contentType) responseHeaders.set("content-type", contentType);
    return new NextResponse(response.body, { status: response.status, headers: responseHeaders });
  } catch {
    return NextResponse.json(
      { success: false, error: "backend_unavailable", message: "The CAMPUS-NEXUS API could not be reached. No demo data was returned." },
      { status: 502 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
