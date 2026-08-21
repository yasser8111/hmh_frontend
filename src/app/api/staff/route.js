import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const backendApi = process.env.BACKEND_API;

export async function GET() {
  if (!backendApi) {
    return NextResponse.json(
      { status: "error", message: "Backend API configuration is missing" },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized - Admin token required" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${backendApi}/staff`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to fetch staff" },
      { status: 502 }
    );
  }
}

export async function POST(request) {
  if (!backendApi) {
    return NextResponse.json(
      { status: "error", message: "Backend API configuration is missing" },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized - Admin token required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const res = await fetch(`${backendApi}/staff`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to create staff member" },
      { status: 502 }
    );
  }
}
