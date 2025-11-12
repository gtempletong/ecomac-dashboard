import { NextResponse } from 'next/server';
import { readSheet } from '@/lib/googleSheets';

export async function GET() {
  try {
    let data;

    try {
      data = await readSheet('Fondos y Series');
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unable to parse range')) {
        console.warn('Sheet "Fondos y Series" not found. Falling back to "Series".');
        data = await readSheet('Series');
      } else {
        throw error;
      }
    }

    const series = (data as Record<string, string | number>[]).filter((row) => {
      const serieValue = row['Serie'] ?? row['Serie '];
      return serieValue !== undefined && String(serieValue).trim() !== '';
    }).map((row) => {
      const tirValue =
        row['TIR Estimada'] ??
        row['TIR ESTIMADA'] ??
        row['TIR en UF'] ??
        row['TIR UF'] ??
        row['tir estimada'] ??
        row['tir_estimada'];

      const normalizedRow = {
        ...row,
        Fondo: row['Fondo'] ?? row['Código Fondo'] ?? row['Codigo Fondo'] ?? ''
      };

      if (tirValue !== undefined && tirValue !== null && tirValue !== '') {
        normalizedRow['TIR Estimada'] = tirValue;
      }

      return normalizedRow;
    });

    return NextResponse.json({ series });
  } catch (error) {
    console.error('Error reading Google Sheets:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
