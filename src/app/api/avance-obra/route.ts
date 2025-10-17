import { NextResponse } from 'next/server';
import { readSheet } from '@/lib/googleSheets';

export async function GET() {
  try {
    const data = await readSheet('Avance Obra');
    return NextResponse.json({ avanceObra: data });
  } catch (error) {
    console.error('Error reading Google Sheets:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}
