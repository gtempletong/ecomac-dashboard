import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

export async function GET() {
  try {
    // Hardcoded paths para evitar problemas con variables de entorno
    const credentialsPath = path.resolve(process.cwd(), 'google_credentials.json');
    const spreadsheetId = '1MjdndQTXVV14Ta9UaIbJZ8Lx0jrDFqsk1fkx9LuP9ig';

    console.log('Using credentials path:', credentialsPath);

    // Verificar que el archivo de credenciales existe
    const fs = require('fs');
    
    if (!fs.existsSync(credentialsPath)) {
      console.error('Credentials file not found:', credentialsPath);
      return NextResponse.json(
        { error: 'Credentials file not found' },
        { status: 500 }
      );
    }

    // Configurar autenticación
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Leer datos de la hoja "Detalles"
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Detalles!A2:I', // Saltar el header
    });

    const rows = response.data.values || [];
    console.log('Raw rows from Google Sheets:', rows);
    
    // Mapeo correcto de columnas según el Google Sheet:
    // 0: Proyecto, 1: Ciudad, 2: Edificios, 3: Pisos, 4: Deptos/Piso
    // 5: UH Totales, 6: Estacionamientos, 7: Avance Ventas (%), 8: Avance Obra (%)
    const projects = rows.map((row: any[]) => ({
      proyecto: row[0] || '',
      ciudad: row[1] || '',
      edificios: parseInt(row[2]) || 0,
      pisos: parseInt(row[3]) || 0,
      uh_totales: parseInt(row[5]) || 0,           // Corregido: era row[4]
      estacionamientos: parseInt(row[6]) || 0,     // Corregido: era row[5]
      avance_ventas: parseFloat(row[7]) || 0,      // Corregido: era row[6]
      avance_obra: parseFloat(row[8]) || 0,        // Corregido: era row[7]
      tir: row[9] ? parseFloat(row[9]) : undefined, // Nota: TIR no está en el sheet aún
    }));

    console.log('Processed projects:', projects);
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: `Failed to fetch projects: ${error.message}` },
      { status: 500 }
    );
  }
}