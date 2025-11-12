import { NextRequest, NextResponse } from 'next/server';
import { fetchDriveFile } from '@/lib/googleSheets';

export const runtime = 'nodejs';

const POOL_ESTRUCTURAS: Record<
  string,
  {
    driveId: string;
    nombre: string;
  }
> = {
  POOL2: {
    driveId: '13kgytBSt7ZHns4mUUjdrP7QJ6OezhzUq',
    nombre: 'Presentación Socios Pool 2',
  },
  POOL3: {
    driveId: '17GvJYl-2lhf782o4KQNg5QfwIddH-sz9',
    nombre: 'Presentación Socios Pool 3',
  },
  POOL4: {
    driveId: '1pxtjBPR2elRkgTtfXMaLDfyUmlU_J395',
    nombre: 'Presentación Socios Pool 4',
  },
};

export async function GET(
  _request: NextRequest,
  context: { params: { poolKey?: string } }
) {
  const poolKey = context.params?.poolKey?.toUpperCase();
  const poolConfig = POOL_ESTRUCTURAS[poolKey];

  if (!poolConfig) {
    return NextResponse.json(
      { error: 'Estructura de pool no disponible' },
      { status: 404 }
    );
  }

  try {
    const { buffer, mimeType, fileName } = await fetchDriveFile(poolConfig.driveId);

    const headers = new Headers();
    headers.set('Content-Type', mimeType);
    headers.set('Content-Disposition', `inline; filename="${fileName}"`);
    headers.set('Cache-Control', 'no-store, max-age=0');

    return new Response(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error descargando estructura de pool desde Google Drive:', error);
    return NextResponse.json(
      { error: 'No fue posible obtener la estructura solicitada' },
      { status: 500 }
    );
  }
}

