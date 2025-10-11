import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectName = searchParams.get('project');

    if (!projectName) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

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

    // Leer datos de la hoja "Sectores"
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sectores!A2:F', // Saltar el header
    });

    const rows = response.data.values || [];
    console.log('Raw rows from Google Sheets:', rows);
    
    // Filtrar sectores para el proyecto específico
    const projectSectors = rows
      .filter((row: string[]) => row[0] === projectName)
      .map((row: string[]) => ({
        sector: row[1] || '',
        cantidad: parseInt(row[2]) || 0,
        porcentaje: parseFloat(row[3]) || 0,
        ventas: parseInt(row[4]) || 0,
        stock: parseInt(row[5]) || 0,
      }));

    console.log('Filtered sectors:', projectSectors);

    return NextResponse.json({ sectors: projectSectors });
  } catch (error) {
    console.error('Error fetching sectors:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to fetch sectors: ${errorMessage}` },
      { status: 500 }
    );
  }
}
