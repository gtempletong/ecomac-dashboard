import { NextResponse } from 'next/server';
import { readSheet } from '@/lib/googleSheets';

const SHEET_PRIORITIES = ['Inmobiliarias', 'Proyectos'];

export async function GET() {
  try {
    let data: Record<string, string | number>[] = [];
    let lastError: unknown = null;

    for (const sheetName of SHEET_PRIORITIES) {
      try {
        data = await readSheet(sheetName);
        if (data.length > 0) {
          break;
        }
      } catch (err) {
        lastError = err;
        const message = err instanceof Error ? err.message : '';
        if (!message.includes('Unable to parse range')) {
          throw err;
        }
        // Si es el error de rango, probar siguiente hoja
      }
    }

    if (data.length === 0) {
      if (lastError) {
        console.warn('No se encontraron datos en las hojas de proyectos. Último error registrado:', lastError);
      }
      return NextResponse.json({ proyectos: [] });
    }

    const proyectos = data.map((row) => {
      const comunaValue = row['Comuna'] ?? row['Ciudad'] ?? '';
      const regionValue = row['Región'] ?? row['Region'] ?? '';

      return {
        'ID Inmobiliaria': String(row['ID Inmobiliaria'] ?? ''),
        'Nombre Inmobiliaria': String(row['Nombre Inmobiliaria'] ?? row['Nombre'] ?? ''),
        'ID Proyecto': String(row['ID Proyecto'] ?? ''),
        'FIP': String(row['FIP'] ?? row['Fondo'] ?? ''),
        'Fondo': String(row['Fondo'] ?? row['FIP'] ?? ''),
        'Nombre Proyecto': String(row['Nombre Proyecto'] ?? row['Proyecto'] ?? ''),
        'Comuna': comunaValue === '' ? '' : String(comunaValue),
        'Región': regionValue === '' ? '' : String(regionValue),
      };
    });

    return NextResponse.json({ proyectos });
  } catch (error) {
    console.error('Error reading Google Sheets:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
