// Evaluate period availability and crowd level based on doctor schedule
export function getPeriodAvailabilityAndCrowd(
  doctorSchedule,
  doctorId,
  dayKey,
  period,
  dateStr,
) {
  if (
    doctorSchedule &&
    Array.isArray(doctorSchedule) &&
    doctorSchedule.length > 0
  ) {
    const daySlots = doctorSchedule.filter(
      (s) => s.day_of_week?.toLowerCase() === dayKey?.toLowerCase(),
    );

    if (daySlots.length > 0) {
      const slot = daySlots.find(
        (s) =>
          s.period?.toLowerCase() === period.toLowerCase() &&
          s.is_active !== false,
      );
      if (!slot) {
        return {
          isAvailable: false,
          level: "unavailable",
          text: "غير متاح اليوم",
          badgeClass: "bg-gray-100 text-gray-600",
          dotClass: "bg-gray-400",
        };
      }
    } else {
      // Doctor does not work on this day
      return {
        isAvailable: false,
        level: "unavailable",
        text: "غير متاح اليوم",
        badgeClass: "bg-gray-100 text-gray-600",
        dotClass: "bg-gray-400",
      };
    }
  }

  // Generate realistic crowd level based on doctor ID, date and period
  const charCodeSum = (doctorId || 1)
    .toString()
    .split("")
    .reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const dateNum = parseInt((dateStr || "").replace(/-/g, ""), 10) || 1;
  const periodOffset = period === "morning" ? 2 : 5;
  const score = (charCodeSum + dateNum + periodOffset) % 10;

  if (score < 4) {
    return {
      isAvailable: true,
      level: "low",
      text: "متاح (لا يوجد ازدحام)",
      badgeClass: "bg-emerald-50 text-emerald-800",
      dotClass: "bg-emerald-500",
    };
  } else if (score < 8) {
    return {
      isAvailable: true,
      level: "medium",
      text: "ازدحام متوسط (مقاعد محدودة)",
      badgeClass: "bg-amber-50 text-amber-800",
      dotClass: "bg-amber-500",
    };
  } else {
    return {
      isAvailable: true,
      level: "high",
      text: "ازدحام شديد (شبه ممتلئ)",
      badgeClass: "bg-rose-50 text-rose-800",
      dotClass: "bg-rose-500",
    };
  }
}
