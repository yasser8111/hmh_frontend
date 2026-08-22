const backendApi = process.env.BACKEND_API;

export const patientsService = {
  // Fetch current authenticated user profile
  async getCurrentUser() {
    let token = "";
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      token = cookieStore.get("token")?.value || "";
    } catch {
      // Running in browser environment
    }

    if (!token && typeof window !== "undefined") {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        if (!res.ok) return null;
        const json = await res.json();
        return json?.data || json || null;
      } catch {
        return null;
      }
    }

    if (!token || !backendApi) return null;

    try {
      const res = await fetch(`${backendApi}/auth/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json?.data || json || null;
    } catch {
      return null;
    }
  },

  // Fetch patients list with optional search (reception/admin)
  async getPatients(search = "") {
    try {
      let url = "/api/patients";
      if (search) {
        url += `?search=${encodeURIComponent(search)}`;
      }
      const res = await fetch(url, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      const json = await res.json();
      return Array.isArray(json?.data) ? json.data : [];
    } catch {
      return [];
    }
  },

  // Fetch patient details with appointments (reception/admin)
  async getPatientById(patientId) {
    if (!patientId) return null;

    try {
      const res = await fetch(`/api/patients/${encodeURIComponent(patientId)}`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json?.data || json || null;
    } catch {
      return null;
    }
  },
};
