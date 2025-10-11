# 🚀 Guía de Despliegue en Vercel

## Pasos para Desplegar en Vercel

### 1. Conectar GitHub con Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Add New Project"
3. Importa el repositorio: `gtempletong/ecomac-dashboard`
4. Selecciona el proyecto

### 2. Configuración del Proyecto

Vercel detectará automáticamente que es un proyecto Next.js. La configuración por defecto debería ser:

- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 3. Subir el Archivo de Credenciales de Google

**IMPORTANTE**: El archivo `google_credentials.json` NO está en GitHub por seguridad.

**Opción A: Subir como Variable de Entorno (Recomendado)**

1. En Vercel, ve a "Settings" > "Environment Variables"
2. Crea una nueva variable:
   - **Name**: `GOOGLE_CREDENTIALS_JSON`
   - **Value**: Copia y pega el contenido completo del archivo `google_credentials.json`
   - **Environment**: Production, Preview, Development

3. Actualiza el código para leer desde la variable de entorno:
   ```typescript
   // En route.ts
   const credentials = process.env.GOOGLE_CREDENTIALS_JSON 
     ? JSON.parse(process.env.GOOGLE_CREDENTIALS_JSON)
     : require(path.resolve(process.cwd(), 'google_credentials.json'));
   ```

**Opción B: Subir el Archivo Directamente**

1. Después del primer deploy, ve al proyecto en Vercel
2. En "Settings" > "General", busca la sección de archivos
3. Sube `google_credentials.json` a la raíz del proyecto
4. Redeploy el proyecto

### 4. Variables de Entorno Adicionales (Opcional)

Si en el futuro quieres usar variables de entorno en lugar de hardcoded values:

```
GOOGLE_SHEETS_SPREADSHEET_ID=1MjdndQTXVV14Ta9UaIbJZ8Lx0jrDFqsk1fkx9LuP9ig
```

### 5. Deploy

1. Haz clic en "Deploy"
2. Vercel construirá y desplegará tu aplicación
3. Una vez completado, obtendrás una URL como: `https://ecomac-dashboard.vercel.app`

### 6. Verificar el Despliegue

1. Abre la URL de tu proyecto
2. Verifica que se carguen los proyectos desde Google Sheets
3. Prueba el modal de detalles

## ⚠️ Solución de Problemas

### Error: "Credentials file not found"

**Solución**: Asegúrate de que el archivo `google_credentials.json` esté en la raíz del proyecto o que la variable de entorno esté configurada correctamente.

### Error: "Failed to fetch projects"

**Solución**: 
1. Verifica que las credenciales de Google tengan acceso al Google Sheet
2. Comprueba que el ID del spreadsheet sea correcto
3. Revisa los logs en Vercel para más detalles

### Error: "API route not found"

**Solución**: Asegúrate de que la estructura de carpetas sea correcta:
```
src/
  app/
    api/
      projects/
        route.ts
      sectors/
        route.ts
```

## 📝 Notas Importantes

- El archivo `google_credentials.json` nunca debe ser committeado a GitHub
- El proyecto usa rutas hardcodeadas para las credenciales para evitar problemas con variables de entorno en Next.js 15
- El Google Sheet debe estar compartido con la cuenta de servicio (email en `client_email` del JSON de credenciales)

## 🔄 Actualizaciones Futuras

Para actualizar el dashboard:

1. Haz cambios localmente
2. Commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   git push
   ```
3. Vercel desplegará automáticamente los cambios

## 🔗 Links Útiles

- **GitHub Repo**: https://github.com/gtempletong/ecomac-dashboard
- **Google Sheet**: https://docs.google.com/spreadsheets/d/1MjdndQTXVV14Ta9UaIbJZ8Lx0jrDFqsk1fkx9LuP9ig

