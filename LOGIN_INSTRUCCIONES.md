# 🔐 Instrucciones para Probar el Login

## ¿Qué se instaló?

1. **next-auth** - Sistema de autenticación
2. **bcryptjs** - Hash de passwords
3. **Endpoint de auth**: `/api/auth/[...nextauth]`
4. **Página de login**: `/login`
5. **Middleware**: protege todas las rutas

## ¿Cómo funciona?

1. Usuario intenta acceder a `/`
2. Middleware verifica si hay sesión
3. Si no hay sesión → redirige a `/login`
4. Usuario ingresa email + password
5. Auth.js verifica en Google Sheets (hoja "Usuarios")
6. Si es correcto → crea sesión JWT
7. Usuario accede al dashboard

## Prueba ahora

### 1. Asegúrate que el servidor está corriendo:
```bash
cd ecomac-client
npm run dev
```

### 2. Abre el navegador:
```
http://localhost:3000
```

### 3. Deberías ver:
- Redirección automática a `/login`
- Formulario de login

### 4. Ingresa:
- **Email**: `admin@ecomac.cl`
- **Password**: `admin123`

### 5. Deberías:
- Entrar al dashboard
- Ver todos los datos (porque eres admin)

## Crear más usuarios

1. Ve a Google Sheets
2. Abre la pestaña "Usuarios"
3. Agrega una fila nueva:
   - **RUT**: `22222222-2`
   - **Email**: `juan@empresa.cl`
   - **Nombre**: `Juan Pérez`
   - **Password**: (genera hash con bcrypt)
   - **Role**: `usuario`
   - **Activo**: `Sí`

## Para generar hash de password:

Puedes usar este código Node.js:
```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('tu-password', 10).then(hash => console.log(hash));
```

## Siguiente paso: Filtrar datos por RUT

Una vez que el login funciona, necesitamos modificar las APIs para:
- Si `role = admin` → devolver TODO
- Si `role = usuario` → filtrar por RUT del usuario



