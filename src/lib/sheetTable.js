import { getSheets, SPREADSHEET_ID } from "../config/google.js";

function toA1(sheetName, a1Range) {
  return `${sheetName}!${a1Range}`;
}

export async function getRows(sheetName, a1Range = "A:Z") {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: toA1(sheetName, a1Range),
  });

  const values = res.data.values || [];
  if (!values.length) return [];

  const headers = values[0];
  return values.slice(1).map((row, index) => {
    const obj = { __rowNumber: index + 2 };
    headers.forEach((header, i) => {
      obj[header] = row[i] ?? "";
    });
    return obj;
  });
}

export async function appendRow(sheetName, rowValues) {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [rowValues],
    },
  });
}

export async function batchAppend(sheetName, rows) {
  if (!rows.length) return;

  const sheets = await getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:Z`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: rows,
    },
  });
}

export async function updateRow(sheetName, rowNumber, rowValues) {
  const sheets = await getSheets();
  const endCol = columnNumberToName(rowValues.length);

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A${rowNumber}:${endCol}${rowNumber}`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [rowValues],
    },
  });
}

function columnNumberToName(number) {
  let name = "";
  let n = number;

  while (n > 0) {
    const rem = (n - 1) % 26;
    name = String.fromCharCode(65 + rem) + name;
    n = Math.floor((n - 1) / 26);
  }

  return name;
}
