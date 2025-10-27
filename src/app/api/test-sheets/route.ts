import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SPREADSHEET_ID = '12Kpl5i6pIqXcRZ4-rGV72j0U8mcUoXD2RgzWXW8T4ro';

export async function GET() {
  try {
    // Obtener credenciales
    let credentials;
    if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
      credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    } else {
      const credentialsPath = path.join(process.cwd(), 'google_credentials.json');
      const credentialsFile = fs.readFileSync(credentialsPath, 'utf8');
      credentials = JSON.parse(credentialsFile);
    }

    // Configurar cliente
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Obtener información del spreadsheet
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetNames = spreadsheet.data.sheets?.map(s => s.properties?.title).filter(Boolean) || [];

    return NextResponse.json({
      spreadsheetId: SPREADSHEET_ID,
      sheetNames,
      sheets: sheetNames.map(name => ({
        title: name
      }))
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}



