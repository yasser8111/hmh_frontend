import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const backendApi = process.env.BACKEND_API;

export async function GET(request, { params }) {
  if (!backendApi) {
    return NextResponse.json(
      { status: "error", message: "Backend API configuration is missing" },
      { status: 500 }
    );
  }

  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { status: "error", message: "Unauthorized - Reception/Admin token required" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${backendApi}/patients/${encodeURIComponent(id)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to fetch patient details" },
      { status: 502 }
    );
  }
}
