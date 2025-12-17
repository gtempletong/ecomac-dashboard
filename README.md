# ECOMAC Dashboard - Fondos y Subyacentes

Dashboard profesional para visualizar y gestionar fondos, series, aportantes, compromisos y subyacentes (proyectos), con integración directa a Google Sheets y Google Drive.

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** 18+ y npm
- **Google Cloud Project** con APIs habilitadas
- **Google Sheets** con datos del dashboard
- **Archivos en Google Drive** (estructuras de pool y presentaciones)

### Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar credenciales de Google:**
   - Crea un archivo `google_credentials.json` en la raíz de `ecomac-client/`
   - Este archivo debe contener las credenciales de una cuenta de servicio de Google Cloud
   - Ver sección "Configuración de Google Cloud" abajo

3. **Ejecutar en desarrollo:**
   ```bash
   npm run dev
   ```

4. **Construir para producción:**
   ```bash
   npm run build
   npm start
   ```

## 📋 Configuración Detallada

### Configuración de Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto nuevo o selecciona uno existente
3. Habilita las siguientes APIs:
   - **Google Sheets API**
   - **Google Drive API**
4. Crea credenciales:
   - Ve a **Credenciales** → **Crear credenciales** → **Cuenta de servicio**
   - Crea una cuenta de servicio y descarga el archivo JSON
   - Guarda el archivo como `google_credentials.json` en la raíz de `ecomac-client/`
5. **IMPORTANTE**: Comparte los siguientes recursos con el email de la cuenta de servicio:
   - El Google Sheet principal (permisos de **Lector** o **Editor**)
   - Los archivos en Google Drive (estructuras de pool y presentaciones PDF)

### Variables de Entorno

El proyecto funciona con credenciales locales en desarrollo. Para producción (Vercel), configura:

- `GOOGLE_CREDENTIALS_JSON`: Contenido completo del archivo `google_credentials.json` como string JSON

### Google Sheets

El dashboard lee datos de un Google Sheet. El ID del spreadsheet está hardcodeado en el código. 

**Nota**: Si necesitas cambiar el spreadsheet, actualiza el ID en los archivos de la API:
- `src/lib/googleSheets.ts`
- `src/app/api/*/route.ts`

### Google Drive

El dashboard muestra imágenes y PDFs desde Google Drive usando IDs de archivos:

**Estructuras de Pool** (configuradas en `src/app/api/estructuras-pool/[poolKey]/route.ts`):
- Pool 2: ID configurado
- Pool 3: ID configurado  
- Pool 4: ID configurado

**Presentaciones** (configuradas en `src/app/api/presentaciones/[fileId]/route.ts`):
- Presentación Pool 1-2-3: ID configurado
- Presentación Pool 4: ID configurado

Para cambiar estos archivos, actualiza los IDs en los archivos de la API correspondientes.

## 🛠️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo en `http://localhost:3000`
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción (después de `build`)
- `npm run lint` - Ejecuta el linter de ESLint

## 📁 Estructura del Proyecto

```
ecomac-client/
├── src/
│   ├── app/              # Rutas y páginas de Next.js
│   │   ├── api/          # API routes (endpoints)
│   │   ├── login/        # Página de login
│   │   └── page.tsx      # Página principal
│   ├── components/       # Componentes React
│   ├── lib/              # Utilidades (Google Sheets, etc.)
│   ├── types/            # Tipos TypeScript
│   └── middleware.ts     # Middleware de Next.js
├── public/               # Archivos estáticos
└── package.json          # Dependencias y scripts
```

## 🔐 Autenticación

El dashboard usa autenticación simple basada en sessionStorage. Los usuarios deben:
1. Tener un RUT válido en el sistema
2. Contraseña encriptada (usar script `generate-password` para crear contraseñas)
3. Rol asignado (`admin` o `usuario`)

## 📦 Dependencias Principales

- **Next.js 15.5.7** - Framework React
- **React 19** - Biblioteca UI
- **Google APIs** - Integración con Google Sheets y Drive
- **Tailwind CSS 4** - Estilos
- **TypeScript** - Tipado estático

## 🚢 Despliegue en Vercel

Ver `VERCEL_DEPLOY.md` para instrucciones detalladas de despliegue.

Resumen:
1. Conecta el repositorio de GitHub con Vercel
2. Configura la variable de entorno `GOOGLE_CREDENTIALS_JSON`
3. Vercel construirá y desplegará automáticamente

## ⚠️ Notas Importantes

- **NUNCA** subas `google_credentials.json` a Git (está en `.gitignore`)
- Los archivos de Drive deben estar compartidos con la cuenta de servicio
- El Google Sheet debe estar compartido con la cuenta de servicio
- Los usuarios solo verán datos según su rol y RUT

## 📝 Licencia

Proyecto privado - Todos los derechos reservados
