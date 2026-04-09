import { SHEET_NAMES } from "../constants/sheetHeaders.js";
import { appendRow, getRows, updateRow } from "../lib/sheetTable.js";
import { createId } from "../lib/ids.js";
import { nowIso } from "../lib/date.js";

export async function findUserByZaloId(zaloId) {
  const rows = await getRows(SHEET_NAMES.USERS, "A:H");
  return rows.find((r) => String(r["Mã Zalo"]) === String(zaloId)) || null;
}

export async function upsertUser({ zaloId, fullName = "", avatar = "" }) {
  const found = await findUserByZaloId(zaloId);
  const now = nowIso();

  if (found) {
    await updateRow(SHEET_NAMES.USERS, found.__rowNumber, [
      found["Mã người dùng"],
      found["Mã Zalo"],
      fullName || found["Họ tên"],
      avatar || found["Ảnh đại diện"],
      found["Cho phép nhận nhắc lịch"] || "FALSE",
      found["Đã tạo lối tắt màn hình chính"] || "FALSE",
      found["Ngày tạo"] || now,
      now,
    ]);

    return {
      userId: found["Mã người dùng"],
      zaloId,
      fullName: fullName || found["Họ tên"] || "",
      avatar: avatar || found["Ảnh đại diện"] || "",
    };
  }

  const userId = createId("ND");
  await appendRow(SHEET_NAMES.USERS, [
    userId,
    zaloId,
    fullName,
    avatar,
    "FALSE",
    "FALSE",
    now,
    now,
  ]);

  return { userId, zaloId, fullName, avatar };
}

export async function setNotificationOptIn(userId, enabled) {
  const rows = await getRows(SHEET_NAMES.USERS, "A:H");
  const found = rows.find((r) => String(r["Mã người dùng"]) === String(userId));
  if (!found) throw new Error("Không tìm thấy người dùng");

  await updateRow(SHEET_NAMES.USERS, found.__rowNumber, [
    found["Mã người dùng"],
    found["Mã Zalo"],
    found["Họ tên"],
    found["Ảnh đại diện"],
    enabled ? "TRUE" : "FALSE",
    found["Đã tạo lối tắt màn hình chính"] || "FALSE",
    found["Ngày tạo"],
    nowIso(),
  ]);
}

export async function setShortcutCreated(userId, enabled) {
  const rows = await getRows(SHEET_NAMES.USERS, "A:H");
  const found = rows.find((r) => String(r["Mã người dùng"]) === String(userId));
  if (!found) throw new Error("Không tìm thấy người dùng");

  await updateRow(SHEET_NAMES.USERS, found.__rowNumber, [
    found["Mã người dùng"],
    found["Mã Zalo"],
    found["Họ tên"],
    found["Ảnh đại diện"],
    found["Cho phép nhận nhắc lịch"] || "FALSE",
    enabled ? "TRUE" : "FALSE",
    found["Ngày tạo"],
    nowIso(),
  ]);
}
