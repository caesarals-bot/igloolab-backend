# 🏥 igloolab Backend API

Backend API REST para el sistema de gestión de inventario farmacéutico **igloolab**. Desarrollado con Node.js, Express, TypeScript y PostgreSQL.

**Versión:** 1.0.0  
**Estado:** 🚧 En Desarrollo Activo  
**Autor:** Cesar Londoño

## 🎯 Estado del Proyecto

- ✅ **Fase 1:** Configuración inicial (Completada)
- ✅ **Fase 2:** Base de datos TypeORM (Completada)
- ✅ **Fase 3:** CRUD de productos (Completada)
- ✅ **Fase 4:** Dashboard y estadísticas (Completada)
- ⏳ **Fase 5:** Sistema de autenticación JWT (Pendiente)
- ⏳ **Fase 6:** Seguridad y middlewares (Pendiente)

---

## 📋 Índice

- [Características](#-características)
- [Tech Stack](#-tech-stack)
- [Prerequisitos](#-prerequisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Base de Datos](#-base-de-datos)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)

---

## ✨ Características

### Implementadas ✅
- 💊 **CRUD completo** de productos farmacéuticos
- 🔍 **Búsqueda y filtros** avanzados de productos
- 📄 **Paginación** en listados
- 📊 **Dashboard** con estadísticas (total productos, valor inventario, productos por vencer)
- ✅ **Validación de datos** con express-validator
- 🐘 **PostgreSQL** con TypeORM (sincronización automática)
- 🐳 **Docker** para desarrollo (PostgreSQL + pgAdmin)
- 📝 **TypeScript** para mayor seguridad de tipos
- 🏗️ **Arquitectura modular** (Controllers, Services, Validators)

### En Desarrollo ⏳
- 🔐 **Autenticación JWT** con tokens de acceso y refresh
- 👤 **Gestión de usuarios** con roles (admin, user)
- 🛡️ **Seguridad** con helmet, CORS y rate limiting
- 🧪 **Testing** con Jest y Supertest
- 📦 **Migraciones** de base de datos

---

## 🛠️ Tech Stack

### Core
- **Node.js** v20+
- **Express.js** v5.1.0
- **TypeScript** v5.9.3
- **PostgreSQL** v16+
- **TypeORM** v0.3+

### Dependencias Principales
- `express-validator` - Validación de requests
- `bcryptjs` - Hash de passwords
- `jsonwebtoken` - Autenticación JWT
- `cors` - Cross-Origin Resource Sharing
- `helmet` - Seguridad HTTP headers
- `morgan` - HTTP request logger
- `dotenv` - Variables de entorno
- `express-rate-limit` - Rate limiting
- `date-fns` - Manejo de fechas
- `reflect-metadata` - Requerido por TypeORM

### Herramientas de Desarrollo
- `tsx` - TypeScript executor con hot reload
- `pkgroll` - Bundler para producción
- `eslint` - Linting
- `prettier` - Formateo de código
- `jest` - Testing framework
- `supertest` - API testing

---

## 📦 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Docker** y **Docker Compose** (para PostgreSQL)
- **Git**

Verificar versiones:
```bash
node --version
npm --version
docker --version
docker-compose --version
```

---

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/igloolab-backend.git
cd igloolab-backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus valores
nano .env
```

### 4. Levantar PostgreSQL con Docker
```bash
docker-compose up -d postgres
```

### 5. Ejecutar migraciones (cuando estén disponibles)
```bash
npm run migration:run
```

### 6. Iniciar servidor de desarrollo
```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:3000`

---

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=igloolab

# JWT Configuration
JWT_SECRET=tu_secret_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=tu_refresh_secret_super_seguro
JWT_REFRESH_EXPIRES_IN=7d

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,https://igloolab.co

# Optional: Cloudinary (para upload de imágenes)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

⚠️ **Importante:** Nunca commitear el archivo `.env` con datos reales. Usa `.env.example` para documentar las variables necesarias.

---

## 🎮 Uso

### Scripts Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Compilar para producción
npm run build

# Ejecutar build de producción
npm start
```

### Scripts TypeORM (configurados, pendiente implementar migraciones)

```bash
# TypeORM - Generar migración
npm run migration:generate -- -n NombreMigracion

# TypeORM - Ejecutar migraciones
npm run migration:run

# TypeORM - Revertir migración
npm run migration:revert

# TypeORM - Ver estado de migraciones
npm run migration:show
```

> **Nota:** Los scripts de testing, linting y formatting se implementarán en fases posteriores.

### Docker Commands

```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de PostgreSQL
docker-compose logs -f postgres

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

---

## 📁 Estructura del Proyecto

```
igloolab-backend/
├── src/
│   ├── config/              # Configuración (database, env, cors)
│   │   ├── database.ts
│   │   ├── env.ts
│   │   └── cors.ts
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   └── dashboard.controller.ts
│   ├── entities/            # TypeORM entities
│   │   ├── User.entity.ts
│   │   └── Product.entity.ts
│   ├── middlewares/         # Express middlewares
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── ratelimit.middleware.ts
│   ├── routes/              # Express routes
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── dashboard.routes.ts
│   │   └── index.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   └── dashboard.service.ts
│   ├── validators/          # express-validator schemas
│   │   ├── auth.validator.ts
│   │   └── product.validator.ts
│   ├── types/               # TypeScript types & interfaces
│   │   ├── express.d.ts
│   │   ├── auth.types.ts
│   │   └── product.types.ts
│   ├── utils/               # Helper functions
│   │   ├── jwt.util.ts
│   │   ├── password.util.ts
│   │   └── response.util.ts
│   ├── migrations/          # TypeORM migrations
│   ├── app.ts               # Express app setup
│   └── index.ts             # Entry point
├── tests/                   # Tests (pendiente)
│   ├── integration/
│   └── unit/
├── .env.example             # Variables de entorno (ejemplo)
├── .gitignore
├── docker-compose.yml       # Docker services
├── tsconfig.json            # TypeScript config
├── package.json
└── README.md
```

---

## 🌐 API Endpoints

### Base URL
- **Desarrollo:** `http://localhost:3000/api`
- **Producción:** `https://api.igloolab.co/api`

### ✅ Productos (Implementado)

Todos los endpoints de productos están actualmente **sin autenticación** para facilitar el desarrollo. Se protegerán con JWT en fase posterior.

#### Listar Productos
```http
GET /api/products?page=1&limit=10&search=paracetamol&sortBy=nombre&order=asc

Response 200:
{
  "products": [
    {
      "id": "uuid",
      "nombre": "Paracetamol 500mg",
      "precio": 15000,
      "descripcion": "Analgésico y antipirético...",
      "fechaElaboracion": "2024-01-15T00:00:00.000Z",
      "fechaVencimiento": "2026-01-15T00:00:00.000Z",
      "imagen": "https://cloudinary.com/image.jpg",
      "createdAt": "2024-11-08T00:00:00.000Z",
      "updatedAt": "2024-11-08T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Obtener Producto por ID
```http
GET /api/products/:id

Response 200:
{
  "product": { ... }
}
```

#### Crear Producto
```http
POST /api/products
Content-Type: application/json

{
  "nombre": "Ibuprofeno 400mg",
  "precio": 20000,
  "descripcion": "Antiinflamatorio no esteroideo",
  "fechaElaboracion": "2024-06-01T00:00:00.000Z",
  "fechaVencimiento": "2026-06-01T00:00:00.000Z",
  "imagen": "https://cloudinary.com/image.jpg"
}

Response 201:
{
  "message": "Producto creado exitosamente",
  "product": { ... }
}
```

#### Actualizar Producto
```http
PUT /api/products/:id
Content-Type: application/json

{
  "precio": 22000,
  "descripcion": "Nueva descripción"
}

Response 200:
{
  "message": "Producto actualizado exitosamente",
  "product": { ... }
}
```

#### Eliminar Producto
```http
DELETE /api/products/:id

Response 200:
{
  "message": "Producto eliminado exitosamente"
}
```

---

### ⏳ Autenticación (Pendiente)

Endpoints planeados:
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Usuario actual
- `POST /api/auth/logout` - Cerrar sesión

---

### ✅ Dashboard (Implementado)

Endpoints sin autenticación (se protegerán con JWT en fase posterior).

#### Estadísticas Generales
```http
GET /api/dashboard/stats

Response 200:
{
  "stats": {
    "totalProducts": 5,
    "totalInventoryValue": 110000,
    "averagePrice": 22000,
    "expiringProducts": 1,
    "expiringProductsList": [
      {
        "id": "uuid",
        "nombre": "Amoxicilina 500mg",
        "fechaVencimiento": "2025-12-05T00:00:00.000Z",
        "daysUntilExpiry": 25
      }
    ]
  }
}
```

**Estadísticas incluidas:**
- `totalProducts` - Total de productos en inventario
- `totalInventoryValue` - Suma de precios de todos los productos
- `averagePrice` - Precio promedio
- `expiringProducts` - Productos que vencen en 30 días
- `expiringProductsList` - Lista ordenada de productos próximos a vencer

#### Estado de Vencimientos
```http
GET /api/dashboard/expiry-status

Response 200:
{
  "expiryStatus": {
    "expired": 0,
    "expiringSoon": 1,
    "valid": 4
  }
}
```

**Grupos:**
- `expired` - Productos ya vencidos
- `expiringSoon` - Vencen en los próximos 30 días
- `valid` - Vencen en más de 30 días

---

### Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Datos inválidos
- `401 Unauthorized` - No autenticado
- `403 Forbidden` - Sin permisos
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

---

## 🗄️ Base de Datos

### Modelo de Datos

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_elaboracion TIMESTAMP NOT NULL,
  fecha_vencimiento TIMESTAMP NOT NULL,
  imagen VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Migraciones

⚠️ **Actualmente en desarrollo**: Se está usando `synchronize: true` en TypeORM, lo que significa que las tablas se crean/actualizan automáticamente al iniciar el servidor.

**Para producción** se implementarán migraciones en `src/migrations/`:

```bash
# Generar nueva migración (pendiente implementar)
npm run migration:generate -- -n CreateUsersTable

# Ejecutar migraciones pendientes (pendiente implementar)
npm run migration:run

# Revertir última migración (pendiente implementar)
npm run migration:revert
```

> **Nota:** En producción se debe configurar `synchronize: false` y usar migraciones para control de versiones de la base de datos.

---

## 🧪 Testing

⏳ **Pendiente implementar**: Sistema de testing con Jest y Supertest.

### Scripts Planeados

```bash
# Todos los tests (pendiente)
npm test

# Tests en modo watch (pendiente)
npm run test:watch

# Tests con coverage (pendiente)
npm run test:coverage
```

### Estructura Planeada

```
tests/
├── integration/
│   ├── products.test.ts
│   └── auth.test.ts
└── unit/
    ├── services/
    └── validators/
```

> **Testing manual**: Actualmente se puede probar la API usando Postman o Thunder Client con los endpoints de productos.

---

## 🚀 Despliegue

### Construcción para Producción

```bash
# Compilar TypeScript
npm run build

# El código compilado estará en dist/
```

### Docker Production (pendiente)

⏳ Dockerfile para producción aún no implementado.

### Variables de Entorno en Producción

⚠️ **Importante:** Cambiar los siguientes valores en producción:

- `NODE_ENV=production`
- `JWT_SECRET` - Usar un secret seguro y largo
- `JWT_REFRESH_SECRET` - Usar un secret diferente al JWT_SECRET
- `DB_PASSWORD` - Contraseña segura para PostgreSQL
- `ALLOWED_ORIGINS` - Solo dominios de producción

---

## 🔒 Seguridad

### Implementadas ✅

- ✅ **Validación de datos** con express-validator  
- ✅ **SQL injection prevention** (TypeORM con prepared statements)  
- ✅ **Variables de entorno** para configuración sensible  
- ✅ **TypeScript** para seguridad de tipos

### Pendientes ⏳

- ⏳ Passwords hasheados con bcrypt
- ⏳ JWT con expiración
- ⏳ CORS configurado
- ⏳ Helmet para security headers
- ⏳ Rate limiting
- ⏳ XSS prevention

---

## 📚 Recursos

- **TypeORM Documentation**: https://typeorm.io/
- **Express.js Guide**: https://expressjs.com/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## 🤝 Contribución

### Proceso de Contribución

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Convenciones de Código

- Usar TypeScript estricto
- Seguir guía de estilo de ESLint
- Formatear con Prettier
- Escribir tests para nuevas features
- Documentar funciones complejas
- Commits descriptivos en inglés

### Checklist antes de PR

- [ ] Sin errores de TypeScript (`npm run build`)
- [ ] Código compila correctamente
- [ ] Servidor inicia sin errores (`npm run dev`)
- [ ] Documentación actualizada
- [ ] .env.example actualizado (si hay nuevas variables)
- [ ] Nuevas funcionalidades testeadas manualmente

---

## 📄 Licencia

ISC License - Ver archivo [LICENSE](./LICENSE) para más detalles.

---

## 👨‍💻 Autor

**Cesar Londoño**
- Email: caesarals@gmail.com
- GitHub: [@cesar](https://github.com/caesarals-bot/igloolab-backend)

---

## 🙏 Agradecimientos

- Equipo de desarrollo frontend igloolab
- Comunidad de TypeORM
- Comunidad de Express.js

---

## 📞 Soporte

Si tienes alguna pregunta o problema, por favor:

1. Revisa la documentación
2. Busca en issues existentes
3. Crea un nuevo issue con detalles

---

## 🗺️ Roadmap

### v1.0.0 (Actual)
- [x] Setup inicial del proyecto
- [ ] Autenticación JWT
- [ ] CRUD de productos
- [ ] Dashboard con estadísticas
- [ ] Testing básico

### v1.1.0 (Futuro)
- [ ] Upload de imágenes a Cloudinary
- [ ] Notificaciones de productos por vencer
- [ ] Export de datos (Excel/PDF)
- [ ] Logs de auditoría
- [ ] API de reportes avanzados

### v2.0.0 (Planificado)
- [ ] WebSockets para notificaciones en tiempo real
- [ ] Gestión de inventario avanzada
- [ ] Múltiples sucursales
- [ ] Integración con sistemas de facturación

---

**¡Gracias por usar igloolab Backend API! 🚀**
