import { NextResponse } from 'next/server';
import { readSheet } from '@/lib/googleSheets';

export async function GET() {
  try {
    let data;

    try {
      data = await readSheet('Fondos y Series');
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unable to parse range')) {
        console.warn('Sheet "Fondos y Series" not found. Falling back to "Fondos".');
        data = await readSheet('Fondos');
      } else {
        throw error;
      }
    }

    const fondos = (data as Record<string, string | number>[]).filter(
      (row) => !row['Serie'] || String(row['Serie']).trim() === ''
    ).map((row) => {
      const tirValue =
        row['TIR Estimada'] ??
        row['TIR ESTIMADA'] ??
        row['TIR en UF'] ??
        row['TIR UF'] ??
        row['tir estimada'] ??
        row['tir_estimada'];

      if (tirValue !== undefined && tirValue !== null && tirValue !== '') {
        row['TIR Estimada'] = tirValue;
      }

      return row;
    });

    return NextResponse.json({ fondos });
  } catch (error) {
    console.error('Error reading Google Sheets:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
