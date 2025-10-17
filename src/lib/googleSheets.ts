import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const SPREADSHEET_ID = '12Kpl5i6pIqXcRZ4-rGV72j0U8mcUoXD2RgzWXW8T4ro';

// Credenciales de la Service Account
const getGoogleSheetsClient = () => {
  let credentials;

  // En producción (Vercel), usar variable de entorno
  if (process.env.GOOGLE_SHEETS_CREDENTIALS) {
    credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
  } else {
    // En desarrollo local, leer del archivo google_credentials.json
    const credentialsPath = path.join(process.cwd(), 'google_credentials.json');
    const credentialsFile = fs.readFileSync(credentialsPath, 'utf8');
    credentials = JSON.parse(credentialsFile);
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
};

export const readSheet = async (sheetName: string) => {
  try {
    const sheets = getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1:ZZ10000`, // Lee todas las columnas hasta ZZ y 10000 filas
    });

    const rows = response.data.values || [];
    
    if (rows.length === 0) {
      return [];
    }

    // Primera fila son los headers
    const headers = rows[0];
    
    // Convertir a array de objetos
    const data = rows.slice(1).map(row => {
      const obj: any = {};
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

