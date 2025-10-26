#!/usr/bin/env python3
"""
Script para listar todas las pestañas del Google Sheet
"""
import gspread
from google.oauth2.service_account import Credentials

# Configuración
SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

def list_sheets():
    # Obtener credenciales
    creds = Credentials.from_service_account_file(
        'google_credentials.json',
        scopes=SCOPES
    )
    
    client = gspread.authorize(creds)
    spreadsheet_id = '12Kpl5i6pIqXcRZ4-rGV72j0U8mcUoXD2RgzWXW8T4ro'
    spreadsheet = client.open_by_key(spreadsheet_id)
    
    print(f"📊 Google Sheet: {spreadsheet.title}")
    print(f"📋 ID: {spreadsheet_id}\n")
    print("Pestañas disponibles:\n")
    
    for sheet in spreadsheet.worksheets():
        print(f"  - {sheet.title}")
    
    print("\n---\n")
    
    # Buscar si existe la pestaña "usuarios"
    try:
        usuarios_sheet = spreadsheet.worksheet("usuarios")
        print("✅ Pestaña 'usuarios' existe")
        
        # Mostrar headers
        headers = usuarios_sheet.row_values(1)
        print(f"📝 Columnas: {', '.join(headers)}")
        
        # Mostrar datos
        data = usuarios_sheet.get_all_records()
        print(f"📊 Total de filas: {len(data)}")
        if data:
            print("\nPrimera fila de datos:")
            for key, value in data[0].items():
                print(f"  {key}: {value}")
    except gspread.exceptions.WorksheetNotFound:
        print("❌ Pestaña 'usuarios' NO existe")
    
    print()

if __name__ == '__main__':
    list_sheets()

