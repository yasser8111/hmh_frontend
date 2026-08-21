const backendApi = process.env.BACKEND_API;

export const patientsService = {
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
