import { NextRequest, NextResponse } from 'next/server';
import { fetchDriveFile, readSheet } from '@/lib/googleSheets';

export const runtime = 'nodejs';

const PRESENTACIONES_PERMITIDAS: Record<
  string,
  { filename: string; description: string }
> = {
  '1E8Labv5XCsY2mL0l3JkjPCzf80FD3NRO': {
    filename: 'Presentacion_Directorio_1.pdf',
    description: 'Presentación Directorio 1',
  },
  '1TWX_IKfch08HfTl8Pt6zpoaEf9sZ0-P1': {
    filename: 'Presentacion_Directorio_2.pdf',
    description: 'Presentación Directorio 2',
  },
};

const SERIES_RESTRINGIDAS = new Set(['A', 'B']);

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string> }
) {
  const { fileId } = params ?? {};

  if (!PRESENTACIONES_PERMITIDAS[fileId]) {
    return NextResponse.json({ error: 'Presentación no disponible' }, { status: 404 });
  }

  const url = new URL(request.url);
  const role = (url.searchParams.get('role') || '').toLowerCase();
  const rut = (url.searchParams.get('rut') || '').trim();

  const isAdmin = role === 'admin';

  if (!isAdmin) {
    if (!rut) {
      return NextResponse.json(
        { error: 'RUT requerido para validar acceso' },
        { status: 400 }
      );
    }

    try {
      const compromisos = await readSheet('Compromisos');

      const compromisosDelUsuario = compromisos.filter((compromiso) => {
        const rutCompromiso = String(compromiso['RUT Aportante'] ?? '').trim();
        return rutCompromiso === rut;
      });

      const tieneSerieRestringida = compromisosDelUsuario.some((compromiso) => {
        const serie = String(compromiso['Serie'] ?? compromiso['Serie '] ?? '')
          .trim()
          .toUpperCase();
        return SERIES_RESTRINGIDAS.has(serie);
      });

      if (tieneSerieRestringida) {
        return NextResponse.json(
          { error: 'No tienes acceso a estas presentaciones' },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error('Error validando acceso a presentaciones:', error);
      return NextResponse.json(
        { error: 'No fue posible validar el acceso a la presentación' },
        { status: 500 }
      );
    }
  }

  try {
    const { buffer, mimeType, fileName } = await fetchDriveFile(fileId);

    const headers = new Headers();
    headers.set('Content-Type', mimeType);
    headers.set('Content-Disposition', `inline; filename="${fileName}"`);

    return new Response(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error descargando presentación desde Google Drive:', error);
    return NextResponse.json(
      { error: 'No fue posible obtener la presentación solicitada' },
      { status: 500 }
    );
  }
}

