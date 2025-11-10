# 🏥 IglooLab Backend API

API REST para sistema de gestión de inventario farmacéutico. Desarrollado con Node.js, Express, TypeScript y PostgreSQL.

**Ver Documentación Técnica Completa:** [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)

---

## ✨ Características

- 💊 **CRUD completo** de productos farmacéuticos
- 🔍 **Búsqueda y filtros** avanzados (case-insensitive)
- 📄 **Paginación** en listados
- 📊 **Dashboard** con estadísticas de inventario
- 🔐 **Autenticación JWT** con access y refresh tokens
- 👤 **Sistema de roles** (admin, user)
- 🖼️ **Soporte de imágenes** (URL y Base64)
- ✅ **Validación robusta** de datos
- 🌐 **CORS** configurado
- 🏗️ **Arquitectura modular** (Controllers, Services, Routes, Middlewares)
- 📝 **TypeScript** con tipado estricto
- 🗄️ **TypeORM** con PostgreSQL

---

## 🛠️ Stack Tecnológico

- **Runtime:** Node.js 20+
- **Framework:** Express.js 5.x
- **Lenguaje:** TypeScript 5.x
- **Base de Datos:** PostgreSQL 14+
- **ORM:** TypeORM 0.3.x
- **Autenticación:** JWT (jsonwebtoken + bcryptjs)
- **Validación:** express-validator
- **CORS:** cors
- **Logger:** morgan

---

## 📦 Requisitos Previos

- Node.js >= 20.0.0
- npm >= 10.0.0
- PostgreSQL >= 14.0

Verificar versiones:
```bash
node --version
npm --version
psql --version
```

---

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd init-node
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Editar `.env` con tus valores:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=igloolab

# JWT
JWT_SECRET=tu_secret_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=tu_refresh_secret_super_seguro
JWT_REFRESH_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Levantar PostgreSQL con Docker (Recomendado)

**Opción A: Usar Docker Compose (Más Fácil)**
```bash
# Iniciar PostgreSQL y pgAdmin
docker-compose up -d

# Solo PostgreSQL
docker-compose up -d postgres

# Verificar que esté corriendo
docker-compose ps
```

PostgreSQL estará disponible en:
- **Host:** localhost
- **Puerto:** 5433
- **User:** postgres
- **Password:** postgres
- **Database:** igloolab

pgAdmin (interfaz web) estará en:
- **URL:** http://localhost:5050
- **Email:** admin@igloolab.co
- **Password:** admin

**Opción B: PostgreSQL Local**

Si prefieres instalar PostgreSQL directamente en tu máquina:
```bash
# Crear base de datos
psql -U postgres -c "CREATE DATABASE igloolab;"

# O ejecutar script completo
psql -U postgres -f database/schema.sql
```

**Nota:** Si usas Docker, el puerto es **5433**. Si usas PostgreSQL local, el puerto es **5432**.

### 5. Iniciar servidor
```bash
# Desarrollo con hot reload
npm run dev

# El servidor estará disponible en http://localhost:3000
```

---

## 📁 Estructura del Proyecto

```
init-node/
├── src/
│   ├── config/              # Configuración (database, env)
│   ├── controllers/         # Controllers (manejo de requests)
│   ├── entities/            # Entidades TypeORM (User, Product)
│   ├── middlewares/         # Middlewares (auth, validation)
│   ├── migrations/          # Migraciones de base de datos
│   ├── routes/              # Definición de rutas
│   ├── services/            # Lógica de negocio
│   ├── utils/               # Utilidades (JWT, password)
│   ├── validators/          # Validaciones con express-validator
│   └── index.ts             # Punto de entrada
├── database/
│   └── schema.sql           # Script SQL de la base de datos
├── docker-compose.yml       # Configuración de Docker
├── .env.example             # Ejemplo de variables de entorno
├── package.json
├── tsconfig.json
├── README.md                # Este archivo
└── TECHNICAL_DOCUMENTATION.md  # Documentación técnica completa
```

---

## 🐳 Docker

### Docker Compose

El proyecto incluye `docker-compose.yml` que configura:
- **PostgreSQL 16** - Base de datos principal
- **pgAdmin 4** - Interfaz de administración web

### Comandos Útiles

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f postgres

# Detener servicios
docker-compose down

# Detener y eliminar datos (⚠️ Cuidado)
docker-compose down -v

# Ver estado de contenedores
docker-compose ps

# Acceder a PostgreSQL desde terminal
docker exec -it igloolab_postgres psql -U postgres -d igloolab

# Ejecutar script SQL en contenedor
docker exec -i igloolab_postgres psql -U postgres -d igloolab < database/schema.sql
```

### Servicios Docker

**PostgreSQL:**
- Container: `igloolab_postgres`
- Puerto: `5433:5432` (externo:interno)
- Credenciales: postgres/postgres
- Database: igloolab
- Volumen: `postgres_data` (persistente)

**pgAdmin:**
- Container: `igloolab_pgadmin`
- Puerto: `5050:80`
- URL: http://localhost:5050
- Credenciales: admin@igloolab.co / admin

### Conectar a PostgreSQL

**Desde tu aplicación:**
```env
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=igloolab
```

**Desde pgAdmin (http://localhost:5050):**
1. Add New Server
2. General → Name: IglooLab
3. Connection:
   - Host: `postgres` (nombre del servicio)
   - Port: `5432` (puerto interno)
   - Username: postgres
   - Password: postgres
   - Database: igloolab

**Desde cliente externo (DBeaver, pgAdmin desktop, etc.):**
- Host: localhost
- Port: 5433
- Username: postgres
- Password: postgres
- Database: igloolab

### Troubleshooting Docker

**Puerto 5433 ya en uso:**
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "5434:5432"  # Usar otro puerto
```

**Ver logs de errores:**
```bash
docker-compose logs postgres
docker-compose logs pgadmin
```

**Reiniciar servicios:**
```bash
docker-compose restart postgres
```

**Limpiar y reiniciar (borra datos):**
```bash
docker-compose down -v
docker-compose up -d
```

---

## 🌐 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registrar usuario | No |
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/refresh` | Renovar access token | No |
| GET | `/auth/me` | Obtener usuario actual | Sí |
| POST | `/auth/logout` | Cerrar sesión | No |

### Productos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/products` | Listar productos (con paginación) | No |
| GET | `/products/:id` | Obtener producto por ID | No |
| POST | `/products` | Crear producto | No |
| PUT | `/products/:id` | Actualizar producto | No |
| DELETE | `/products/:id` | Eliminar producto | No |

**Query Parameters para GET /products:**
- `page` (number): Página (default: 1)
- `limit` (number): Resultados por página (default: 10, max: 100)
- `search` (string): Búsqueda por nombre (case-insensitive)
- `sortBy` (string): Campo para ordenar (default: createdAt)
- `order` (string): asc | desc (default: DESC)

### Dashboard

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/dashboard/stats` | Estadísticas de inventario | No |

---

## 📝 Ejemplos de Uso

### Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin User",
    "email": "admin@igloolab.com",
    "password": "Admin123",
    "role": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@igloolab.com",
    "password": "Admin123"
  }'
```

### Listar Productos
```bash
curl http://localhost:3000/api/products?page=1&limit=10&search=paracetamol
```

### Crear Producto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Paracetamol 500mg",
    "precio": 15000,
    "descripcion": "Analgésico y antipirético",
    "fechaElaboracion": "2024-01-15T00:00:00.000Z",
    "fechaVencimiento": "2026-01-15T00:00:00.000Z",
    "imageUrl": "https://example.com/image.jpg"
  }'
```

### Obtener Usuario Actual (con token)
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer {tu_access_token}"
```

---

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)** con dos tipos de tokens:

### Access Token
- **Duración:** 24 horas (configurable)
- **Uso:** Autenticar requests al API
- **Header:** `Authorization: Bearer {accessToken}`

### Refresh Token
- **Duración:** 7 días (configurable)
- **Uso:** Renovar access token sin re-login

### Flujo de Autenticación
1. Usuario hace login → Recibe `accessToken` y `refreshToken`
2. Frontend guarda tokens en `localStorage`
3. Frontend incluye `accessToken` en header `Authorization`
4. Cuando `accessToken` expira → Usar `refreshToken` para obtener nuevo
5. Si `refreshToken` expira → Usuario debe hacer login nuevamente

---

## 🎨 Integración con Frontend

### Configurar Axios
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// Agregar token automáticamente
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejar refresh automático
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(
          'http://localhost:3000/api/auth/refresh',
          { refreshToken }
        );
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### TypeScript Types
```typescript
export interface Product {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  fechaElaboracion: string;
  fechaVencimiento: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}
```

---

## 🗄️ Base de Datos

### Schema SQL
El script completo de la base de datos está en `database/schema.sql`

### Tablas Principales

**users**
- `id` (UUID)
- `nombre` (VARCHAR 255)
- `email` (VARCHAR 255, UNIQUE)
- `password` (VARCHAR 255, hashed con bcrypt)
- `role` (ENUM: admin, user)
- `created_at`, `updated_at`

**products**
- `id` (UUID)
- `nombre` (VARCHAR 255)
- `precio` (DECIMAL 10,2)
- `descripcion` (TEXT)
- `fecha_elaboracion` (TIMESTAMP)
- `fecha_vencimiento` (TIMESTAMP)
- `imageUrl` (TEXT) - Soporta URLs y Base64
- `created_at`, `updated_at`

---

## 🔨 Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Compilar TypeScript a JavaScript
npm run build

# Ejecutar build de producción
npm start

# Migraciones TypeORM
npm run migration:run      # Ejecutar migraciones
npm run migration:revert   # Revertir última migración
```

---

## 📊 Validaciones

### Validación de Productos
- **nombre:** 3-255 caracteres, requerido
- **precio:** Número >= 0, requerido
- **descripcion:** Mínimo 10 caracteres, requerido
- **fechaElaboracion:** Fecha válida ISO 8601, requerida
- **fechaVencimiento:** Fecha válida, debe ser > fechaElaboracion
- **imageUrl:** URL válida o Base64 (data:image/...), opcional

### Validación de Registro
- **nombre:** 2-255 caracteres
- **email:** Email válido y único
- **password:** Mínimo 6 caracteres, 1 mayúscula, 1 minúscula, 1 número
- **role:** 'admin' o 'user' (opcional, default: 'user')

---

## 🚀 Despliegue a Producción

### 1. Compilar proyecto
```bash
npm run build
```

### 2. Configurar variables de entorno
Cambiar en producción:
- `NODE_ENV=production`
- `JWT_SECRET` - Secret fuerte y único
- `JWT_REFRESH_SECRET` - Diferente al JWT_SECRET
- `DB_PASSWORD` - Password segura
- `ALLOWED_ORIGINS` - Solo dominios de producción

### 3. Desactivar synchronize de TypeORM
En `src/config/database.ts`:
```typescript
synchronize: false  // Usar migraciones en producción
```

### 4. Ejecutar migraciones
```bash
npm run migration:run
```

---

## 📚 Documentación Adicional

- **Documentación Técnica Completa:** [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)
- **Script SQL:** [database/schema.sql](./database/schema.sql)
- **Ejemplo de .env:** [.env.example](./.env.example)

---

## 👨‍💻 Autor

**Cesar Londoño**  
Email: caesarals@gmail.com

---

## 📄 Licencia

ISC License

---

**¡Gracias por usar IglooLab Backend API! 🚀**
