const backendApi = process.env.BACKEND_API;

export const staffService = {
  // Fetch staff list (admin)
  async getStaff() {
    try {
      const res = await fetch("/api/staff", {
        cache: "no-store",
      });
      if (!res.ok) return [];
      const json = await res.json();
      return Array.isArray(json?.data) ? json.data : [];
    } catch {
      return [];
    }
  },

  // Fetch staff member by ID (admin)
  async getStaffById(staffId) {
    if (!staffId) return null;

    try {
      const res = await fetch(`/api/staff/${encodeURIComponent(staffId)}`, {
        cache: "no-store",
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json?.data || null;
    } catch {
      return null;
    }
  },

  // Create staff member (admin)
  async createStaff(payload) {
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      return { success: res.ok, data: data?.data || data, message: data?.message };
    } catch {
      return { success: false, message: "فشل الاتصال بالخادم" };
    }
  },

  // Update staff member (admin)
  async updateStaff(staffId, payload) {
    if (!staffId) return { success: false };

    try {
      const res = await fetch(`/api/staff/${encodeURIComponent(staffId)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      return { success: res.ok, data: data?.data || data, message: data?.message };
    } catch {
      return { success: false, message: "فشل الاتصال بالخادم" };
    }
  },

  // Delete staff member (admin)
  async deleteStaff(staffId) {
    if (!staffId) return { success: false };

    try {
      const res = await fetch(`/api/staff/${encodeURIComponent(staffId)}`, {
        method: "DELETE",
      });
      return { success: res.ok };
    } catch {
      return { success: false, message: "فشل الاتصال بالخادم" };
    }
  },
};
