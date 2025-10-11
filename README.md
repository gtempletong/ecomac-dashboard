# ECOMAC II - Dashboard de Proyectos Inmobiliarios

Dashboard profesional para visualizar y gestionar proyectos inmobiliarios del fondo ECOMAC II.

## 🚀 Características

- **Dashboard interactivo** con métricas en tiempo real
- **Integración con Google Sheets** para gestión de datos
- **Modal de detalles** por proyecto con gráficos de sectores
- **Responsive design** con Tailwind CSS
- **Next.js 15** con React 19 y TypeScript

## 📊 Funcionalidades

- Vista general de todos los proyectos
- Métricas agregadas (Total UH, Edificios, Avance promedio, Ciudades)
- Tabla interactiva de proyectos
- Modal con análisis detallado por sectores
- Gráficos de distribución (pie chart y bar chart)

## 🛠️ Tecnologías

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- Google Sheets API
- Recharts

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
# Las credenciales de Google Sheets deben estar en la raíz del proyecto

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
npm start
```

## 🔐 Configuración de Google Sheets

1. Crear un proyecto en Google Cloud Console
2. Habilitar Google Sheets API
3. Crear credenciales de cuenta de servicio
4. Descargar el archivo JSON de credenciales como `google_credentials.json`
5. Colocar el archivo en la raíz del proyecto

## 🌐 Despliegue en Vercel

Este proyecto está optimizado para desplegarse en Vercel:

1. Conectar el repositorio de GitHub con Vercel
2. Configurar las variables de entorno en Vercel (si necesario)
3. Subir `google_credentials.json` como archivo en Vercel
4. Deploy automático

## 📝 Estructura del Google Sheet

### Hoja "Detalles"
- Proyecto
- Ciudad
- Edificios
- Pisos
- Deptos/Piso
- UH Totales
- Estacionamientos
- Avance Ventas (%)
- Avance Obra (%)

### Hoja "Sectores"
- Proyecto
- Sector (Medios/Emergentes/Vulnerables/Totales)
- Cantidad
- Porcentaje
- Ventas
- Stock

## 📄 Licencia

Proyecto privado - ECOMAC II
