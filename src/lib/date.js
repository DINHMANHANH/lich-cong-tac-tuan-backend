export function nowIso() {
  return new Date().toISOString();
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function formatLocalDate(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function getWeekInfo(dateInput = new Date()) {
  const d = new Date(dateInput);
  const day = d.getDay(); // 0 = CN, 1 = T2, ...
  const diff = day === 0 ? -6 : 1 - day;

  const start = new Date(d);
  start.setDate(d.getDate() + diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(0, 0, 0, 0);

  const firstDayOfYear = new Date(start.getFullYear(), 0, 1);
  const pastDays = Math.floor((start - firstDayOfYear) / 86400000);
  const weekNumber = Math.ceil((pastDays + firstDayOfYear.getDay() + 1) / 7);

  return {
    weekStart: formatLocalDate(start),
    weekEnd: formatLocalDate(end),
    weekNumber,
  };
}
