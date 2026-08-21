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
      { status: "error", message: "Unauthorized - Admin token required" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${backendApi}/staff/${encodeURIComponent(id)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to fetch staff member" },
      { status: 502 }
    );
  }
}

export async function PUT(request, { params }) {
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
      { status: "error", message: "Unauthorized - Admin token required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const res = await fetch(`${backendApi}/staff/${encodeURIComponent(id)}`, {
      method: "PUT",
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
      { status: "error", message: error.message || "Failed to update staff member" },
      { status: 502 }
    );
  }
}

export async function DELETE(request, { params }) {
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
      { status: "error", message: "Unauthorized - Admin token required" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${backendApi}/staff/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error.message || "Failed to delete staff member" },
      { status: 502 }
    );
  }
}
