#!/usr/bin/env python3
"""Mostrar todos los usuarios"""
import gspread
from google.oauth2.service_account import Credentials

SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
]

creds = Credentials.from_service_account_file('google_credentials.json', scopes=SCOPES)
client = gspread.authorize(creds)
spreadsheet = client.open_by_key('12Kpl5i6pIqXcRZ4-rGV72j0U8mcUoXD2RgzWXW8T4ro')
sheet = spreadsheet.worksheet('usuarios')

print("Todos los usuarios:")
print("=" * 60)
for row in sheet.get_all_records():
    print(f"RUT: {row['RUT']}")
    print(f"Email: {row['Email']}")
    print(f"Password: {row['password']}")
    print("-" * 60)



