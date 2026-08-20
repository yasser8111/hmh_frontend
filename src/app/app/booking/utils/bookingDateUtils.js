// Arabic day and month name maps
export const ARABIC_DAYS_MAP = {
  Sun: "الأحد",
  Mon: "الإثنين",
  Tue: "الثلاثاء",
  Wed: "الأربعاء",
  Thu: "الخميس",
  Fri: "الجمعة",
  Sat: "السبت",
};

const ARABIC_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

// Generate upcoming booking days (default: 14 days)
export function getAvailableBookingDays(daysCount = 14) {
  const days = [];
  const today = new Date();

  for (let i = 0; i < daysCount; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const dayKey = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];

    days.push({
      dateStr,
      dayKey,
      dayName: ARABIC_DAYS_MAP[dayKey] || "",
      dayNumber: d.getDate(),
      monthName: ARABIC_MONTHS[d.getMonth()] || "",
      isToday: i === 0,
      isTomorrow: i === 1,
    });
  }

  return days;
}

// Format date string to Arabic friendly format
export function formatArabicDate(dateStr) {
  if (!dateStr) return "";
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayKey = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dateObj.getDay()];
    const dayName = ARABIC_DAYS_MAP[dayKey] || "";
    const monthName = ARABIC_MONTHS[m - 1] || "";
    return `${dayName}، ${d} ${monthName} ${y}`;
  } catch {
    return dateStr;
  }
}
