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

  try {
    const res = await fetch(`${backendApi}/specialties`, {
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to fetch specialties" },
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

  try {
    const body = await request.json().catch(() => ({}));
    const res = await fetch(`${backendApi}/specialties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to create specialty" },
      { status: 502 }
    );
  }
}
