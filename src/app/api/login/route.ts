import { NextResponse } from 'next/server';
import { readSheet } from '@/lib/googleSheets';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y password requeridos' },
        { status: 400 }
      );
    }

    // Leer usuarios de Google Sheets
    const usuarios = await readSheet('usuarios');
    
    // Buscar usuario por email
    const usuario = usuarios.find((u: Record<string, string | number>) => u.Email === email);
    
    if (!usuario) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Verificar si está activo
    if (usuario.Activo !== 'SI') {
      return NextResponse.json(
        { error: 'Usuario inactivo' },
        { status: 401 }
      );
    }

    // Verificar password (convertir ambos a string para comparar)
    if (String(password) !== String(usuario.password)) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    }

    // Retornar datos del usuario (sin password)
    const userData = {
      rut: usuario.RUT,
      email: usuario.Email,
      nombre: usuario.Nombre,
      role: usuario.Role || usuario.role // Intentar ambos nombres
    };
    
    return NextResponse.json({ user: userData });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error al iniciar sesión' },
      { status: 500 }
    );
  }
}

