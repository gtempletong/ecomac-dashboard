#!/usr/bin/env python3
"""
Script para crear la estructura de usuarios en Google Sheets
"""
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import json

# Configuración
SPREADSHEET_ID = '12Kpl5i6pIqXcRZ4-rGV72j0U8mcUoXD2RgzWXW8T4ro'
CREDENTIALS_FILE = 'google_credentials.json'

def crear_estructura_usuarios():
    # Conectar a Google Sheets
    scope = ['https://spreadsheets.google.com/feeds',
             'https://www.googleapis.com/auth/drive']
    
    credentials = ServiceAccountCredentials.from_json_keyfile_name(
        CREDENTIALS_FILE, scope)
    client = gspread.authorize(credentials)
    
    # Abrir el spreadsheet
    spreadsheet = client.open_by_key(SPREADSHEET_ID)
    
    # Intentar abrir la hoja "Usuarios" o crearla si no existe
    try:
        sheet = spreadsheet.worksheet('Usuarios')
        print("✅ Hoja 'Usuarios' ya existe")
    except:
        print("📝 Creando hoja 'Usuarios'...")
        sheet = spreadsheet.add_worksheet(title='Usuarios', rows=100, cols=6)
    
    # Headers
    headers = ['RUT', 'Email', 'Nombre', 'Password', 'Role', 'Activo']
    
    # Limpiar contenido existente (opcional)
    sheet.clear()
    
    # Escribir headers
    sheet.append_row(headers)
    
    # Usuario admin de ejemplo (password ya hasheada)
    admin_password = '$2b$10$hN1IQbzBelH/UGrjQ/54YuzVretsa6Sr6r5LtRo6TY29boTDAugiW'  # admin123
    usuarios_ejemplo = [
        ['11111111-1', 'admin@ecomac.cl', 'Administrador', admin_password, 'admin', 'Sí'],
        # Agrega más usuarios aquí
    ]
    
    # Escribir usuarios
    for usuario in usuarios_ejemplo:
        sheet.append_row(usuario)
    
    print("\n✅ Usuarios creados exitosamente!")
    print("\n📋 Usuario admin:")
    print("   Email: admin@ecomac.cl")
    print("   Password: admin123")
    print("   Role: admin")

if __name__ == '__main__':
    crear_estructura_usuarios()

