import { NextResponse } from "next/server";

const backendApi = process.env.BACKEND_API;

export async function GET() {
  if (!backendApi) {
    return NextResponse.json(
      { status: "error", message: "Backend API configuration is missing" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${backendApi}/health`, {
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message || "Backend service is unreachable" },
      { status: 502 }
    );
  }
}
