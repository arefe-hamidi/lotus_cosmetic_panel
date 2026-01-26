import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, API_SUB_KEY } from "@/lib/configs/constants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, params, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, params, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, params, "PUT");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, params, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, params, "DELETE");
}

async function handleProxyRequest(
  request: NextRequest,
  params: Promise<{ path: string[] }>,
  method: string
) {
  try {
    // Await params (Next.js 15+ requires this)
    const resolvedParams = await params;
    
    // Reconstruct the endpoint path
    const path = `/${resolvedParams.path.join("/")}`;
    
    // Get query string from the original request
    const searchParams = request.nextUrl.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : "";
    const endpoint = `${path}${queryString}`;

    // Get auth token from cookies - try both methods
    const cookieStore = await cookies();
    let authTokenRaw = cookieStore.get("auth-token")?.value;
    
    // If not found in cookieStore, try reading from request headers
    if (!authTokenRaw) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const cookies = cookieHeader.split(";");
        for (const cookie of cookies) {
          const trimmed = cookie.trim();
          if (trimmed.startsWith("auth-token=")) {
            authTokenRaw = trimmed.substring("auth-token=".length);
            break;
          }
        }
      }
    }
    
    // Decode the token (it's encoded with encodeURIComponent when set)
    const authToken = authTokenRaw ? decodeURIComponent(authTokenRaw).trim() : null;

    // Get content type first to determine body handling
    const contentType = request.headers.get("content-type");
    const isFormData = contentType?.includes("multipart/form-data");

    // Prepare headers
    const headers: Record<string, string> = {};

    // Add Content-Type only if not FormData
    if (!isFormData) {
      headers["Content-Type"] = contentType || "application/json";
    }

    // Add subscription key if available
    if (API_SUB_KEY) {
      headers["ocp-apim-subscription-key"] = API_SUB_KEY;
    }

    // Add authorization header if token exists
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    } else {
      // Log for debugging
      const cookieHeader = request.headers.get("cookie");
      const allCookies = cookieStore.getAll();
      console.warn("No auth token found in cookies for proxy request to:", endpoint);
      console.warn("Cookie header present:", !!cookieHeader);
      console.warn("Cookie header value:", cookieHeader?.substring(0, 200));
      console.warn("All cookies from cookieStore:", allCookies.map(c => c.name));
    }

    // Get request body if it exists
    let body: BodyInit | undefined;
    if (method !== "GET" && method !== "HEAD") {
      // Check if it's FormData
      if (isFormData) {
        body = await request.formData();
      } else {
        try {
          body = await request.text();
        } catch {
          // No body
        }
      }
    }

    // Build the target URL
    const targetUrl = `${API_BASE_URL}${endpoint}`;

    // Make the proxy request
    const response = await fetch(targetUrl, {
      method,
      headers,
      body: body || undefined,
    });

    // Get response body
    const responseBody = await response.text();

    // Create response with same status and headers
    const proxyResponse = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
    });

    // Copy relevant response headers
    const contentTypeHeader = response.headers.get("content-type");
    if (contentTypeHeader) {
      proxyResponse.headers.set("Content-Type", contentTypeHeader);
    }

    return proxyResponse;
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
