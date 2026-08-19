// Service handling all hospital booking and medical catalog API calls

const getBackendApi = () => {
  return (process.env.NEXT_PUBLIC_BACKEND_API || process.env.BACKEND_API || "").replace(/\/$/, "");
};

export const bookingService = {
  // Fetch active medical specialties
  async getSpecialties() {
    const backendApi = getBackendApi();
    if (!backendApi) return [];

    try {
      const res = await fetch(`${backendApi}/specialties`, { cache: "no-store" });
      if (!res.ok) return [];
      const json = await res.json();
      return json?.data || [];
    } catch {
      return [];
    }
  },

  // Fetch active doctors list
  async getDoctors(limit = 100) {
    const backendApi = getBackendApi();
    if (!backendApi) return [];

    try {
      const res = await fetch(`${backendApi}/doctors?limit=${limit}`, { cache: "no-store" });
      if (!res.ok) return [];
      const json = await res.json();
      return json?.data || [];
    } catch {
      return [];
    }
  },

  // Create new patient appointment
  async createAppointment(payload) {
    const backendApi = getBackendApi();
    if (!backendApi) return null;

    try {
      const res = await fetch(`${backendApi}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) return null;
      const json = await res.json();
      return json?.data || null;
    } catch {
      return null;
    }
  },
};
