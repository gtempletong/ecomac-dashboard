import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

export async function GET() {
  try {
    let credentials;

    // Try to load credentials
    if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
      credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
      console.log('✅ Loaded from environment variable');
    } else {
      const credentialsPath = path.join(process.cwd(), 'google_credentials.json');
      const credentialsFile = fs.readFileSync(credentialsPath, 'utf8');
      credentials = JSON.parse(credentialsFile);
      console.log('✅ Loaded from file');
    }

    // Create auth
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Test reading
    const SPREADSHEET_ID = '12Kpl5i6pIqXcRZ4-rGV72j0U8mcUoXD2RgzWXW8T4ro';
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Fondos!A1:B5',
    });

    return NextResponse.json({
      success: true,
      message: 'Google Sheets credentials are working!',
      serviceAccount: credentials.client_email,
      sampleData: response.data.values,
    });

  } catch (error: any) {
    console.error('Error testing credentials:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
    }, { status: 500 });
  }
}

