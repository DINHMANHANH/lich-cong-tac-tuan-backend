import { SHEET_NAMES } from "../constants/sheetHeaders.js";
import { appendRow, batchAppend, getRows } from "../lib/sheetTable.js";
import { createId } from "../lib/ids.js";
import { nowIso } from "../lib/date.js";

export async function createWeeklyPlan({
  userId,
  weekNumber,
  weekStart,
  weekEnd,
  title = "Lịch công tác tuần",
  note = "",
  items = [],
}) {
  const planId = createId("LT");
  const now = nowIso();

  await appendRow(SHEET_NAMES.PLANS, [
    planId,
    userId,
    weekNumber,
    weekStart,
    weekEnd,
    title,
    note,
    now,
    now,
  ]);

  const itemRows = items.map((item) => [
    createId("CT"),
    planId,
    item.workDate,
    item.session,
    item.startTime || "",
    item.endTime || "",
    item.content,
    item.location || "",
    item.coordinator || "",
    item.reminderEnabled ? "TRUE" : "FALSE",
    "",
    item.status || "Chưa thực hiện",
  ]);

  await batchAppend(SHEET_NAMES.ITEMS, itemRows);

  return { planId };
}

export async function getWeeklyPlan(userId, weekStart) {
  const plans = await getRows(SHEET_NAMES.PLANS, "A:I");
  const items = await getRows(SHEET_NAMES.ITEMS, "A:L");

  const plan = plans.find(
    (r) =>
      String(r["Mã người dùng"]) === String(userId) &&
      String(r["Từ ngày"]) === String(weekStart)
  );

  if (!plan) return null;

  return {
    planId: plan["Mã lịch tuần"],
    title: plan["Tiêu đề lịch"],
    note: plan["Ghi chú"],
    weekStart: plan["Từ ngày"],
    weekEnd: plan["Đến ngày"],
    weekNumber: plan["Tuần thứ"],
    items: items
      .filter((r) => String(r["Mã lịch tuần"]) === String(plan["Mã lịch tuần"]))
      .map((r) => ({
        itemId: r["Mã chi tiết"],
        workDate: r["Ngày công tác"],
        session: r["Buổi"],
        startTime: r["Giờ bắt đầu"],
        endTime: r["Giờ kết thúc"],
        content: r["Nội dung công tác"],
        location: r["Địa điểm"],
        coordinator: r["Người phối hợp"],
        reminderEnabled: r["Bật nhắc lịch"] === "TRUE",
        remindedAt: r["Thời điểm đã nhắc"],
        status: r["Trạng thái"],
      })),
  };
}
