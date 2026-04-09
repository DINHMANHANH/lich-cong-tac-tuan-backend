import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

export async function getSheets() {
  const client = await auth.getClient();
  return google.sheets({
    version: "v4",
    auth: client,
  });
}
