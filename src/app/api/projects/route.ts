import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

export async function GET() {
  try {
    // Usar variable de entorno en Vercel o archivo local en desarrollo
    const credentialsJson = process.env.GOOGLE_CREDENTIALS_JSON;
    const spreadsheetId = '1MjdndQTXVV14Ta9UaIbJZ8Lx0jrDFqsk1fkx9LuP9ig';

    console.log('Environment check:', { 
      hasCredentialsEnv: !!credentialsJson, 
      nodeEnv: process.env.NODE_ENV 
    });

    let credentials;
    
    if (credentialsJson) {
      // En Vercel: usar variable de entorno
      try {
        credentials = JSON.parse(credentialsJson);
        console.log('Using environment credentials');
      } catch (error) {
        console.error('Error parsing credentials from env:', error);
        return NextResponse.json(
          { error: 'Invalid credentials format in environment' },
          { status: 500 }
        );
      }
    } else {
      // En desarrollo: usar archivo local
      const credentialsPath = path.resolve(process.cwd(), 'google_credentials.json');
      const fs = await import('fs');
      
      if (!fs.existsSync(credentialsPath)) {
        console.error('Credentials file not found:', credentialsPath);
        return NextResponse.json(
          { error: 'Credentials file not found' },
          { status: 500 }
        );
      }
      
      credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      console.log('Using local credentials file');
    }

    // Configurar autenticación
    const auth = new google.auth.GoogleAuth({
      credentials,
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
    const projects = rows.map((row: string[]) => ({
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch projects: ${errorMessage}` },
      { status: 500 }
    );
  }
}