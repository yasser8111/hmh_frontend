import { NextResponse } from "next/server";

const backendApi = process.env.BACKEND_API;

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const response = await fetch(`${backendApi}/doctors/${encodeURIComponent(id)}/schedule`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Get doctor schedule API error:", error);
    return NextResponse.json(
      { success: false, message: "فشل الاتصال بخادم الباك إند" },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const token = request.cookies.get("token")?.value;
    const body = await request.json();

    const response = await fetch(`${backendApi}/doctors/${encodeURIComponent(id)}/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Update doctor schedule API error:", error);
    return NextResponse.json(
      { success: false, message: "فشل الاتصال بخادم الباك إند" },
      { status: 500 }
    );
  }
}
