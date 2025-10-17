import { NextResponse } from 'next/server';
import * as fs from 'fs';

export async function GET() {
  try {
    const excelPath = 'C:\\ecomac\\dashboard_final.xlsx';
    
    // Verificar si el archivo existe
    const exists = fs.existsSync(excelPath);
    
    // Intentar leer los permisos
    let readable = false;
    try {
      fs.accessSync(excelPath, fs.constants.R_OK);
      readable = true;
    } catch (err) {
      readable = false;
    }
    
    // Obtener estadísticas del archivo
    const stats = exists ? fs.statSync(excelPath) : null;
    
    return NextResponse.json({
      exists,
      readable,
      path: excelPath,
      size: stats?.size,
      modified: stats?.mtime,
      error: exists && !readable ? 'Archivo existe pero no es accesible' : null
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}


