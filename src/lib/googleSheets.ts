import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SPREADSHEET_ID = '12Kpl5i6pIqXcRZ4-rGV72j0U8mcUoXD2RgzWXW8T4ro';

const getCredentials = () => {
  if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
    return JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
  }

  const credentialsPath = path.join(process.cwd(), 'google_credentials.json');
  const credentialsFile = fs.readFileSync(credentialsPath, 'utf8');
  return JSON.parse(credentialsFile);
};

export const getGoogleAuth = (scopes: string[]) => {
  const credentials = getCredentials();

  return new google.auth.GoogleAuth({
    credentials,
    scopes,
  });
};

export const getGoogleSheetsClient = () => {
  const auth = getGoogleAuth(['https://www.googleapis.com/auth/spreadsheets.readonly']);
  return google.sheets({ version: 'v4', auth });
};

export const getGoogleDriveClient = () => {
  const auth = getGoogleAuth(['https://www.googleapis.com/auth/drive.readonly']);
  return google.drive({ version: 'v3', auth });
};

export const fetchDriveFile = async (fileId: string) => {
  const drive = getGoogleDriveClient();

  const [metadataResponse, fileResponse] = await Promise.all([
    drive.files.get({
      fileId,
      fields: 'mimeType, name',
    }),
    drive.files.get(
      {
        fileId,
        alt: 'media',
      },
      { responseType: 'arraybuffer' }
    ),
  ]);

  const buffer = Buffer.from(fileResponse.data as ArrayBuffer);
  const mimeType = metadataResponse.data.mimeType || 'application/octet-stream';
  const fileName = metadataResponse.data.name || 'archivo';

  return { buffer, mimeType, fileName };
};

export const readSheet = async (sheetName: string) => {
  try {
    const sheets = getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`, // Lee las columnas A-Z sin límite de filas
    });

    const rows = response.data.values || [];
    
    if (rows.length === 0) {
      return [];
    }

    // Primera fila son los headers
    const headers = rows[0];
    
    // Convertir a array de objetos
    const data = rows.slice(1).map(row => {
      const obj: Record<string, string | number> = {};
      headers.forEach((header, index) => {
        const value = row[index];
        // Intentar convertir a número si es posible
        obj[header] = isNaN(Number(value)) ? value : Number(value);
      });
      return obj;
    }).filter(row => {
      // Filtrar filas vacías (todas las columnas undefined o vacías)
      return Object.values(row).some(val => val !== undefined && val !== '');
    });

    return data;
  } catch (error) {
    console.error(`Error reading sheet ${sheetName}:`, error);
    throw error;
  }
};

