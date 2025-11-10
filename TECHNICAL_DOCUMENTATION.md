# 📚 Documentación Técnica - IglooLab Backend

## 📋 Tabla de Contenidos
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Base de Datos](#base-de-datos)
- [Autenticación y Seguridad](#autenticación-y-seguridad)
- [API Endpoints](#api-endpoints)
- [Modelos de Datos](#modelos-de-datos)
- [Validaciones](#validaciones)
- [Configuración](#configuración)

---

## 🏗️ Arquitectura del Sistema

### Patrón de Arquitectura
El proyecto sigue una **arquitectura en capas** (Layered Architecture):

```
┌─────────────────────────────────────────┐
│         Routes Layer                    │  ← Definición de rutas HTTP
├─────────────────────────────────────────┤
│      Middlewares Layer                  │  ← Validación, Auth, CORS
├─────────────────────────────────────────┤
│      Controllers Layer                  │  ← Manejo de requests/responses
├─────────────────────────────────────────┤
│       Services Layer                    │  ← Lógica de negocio
├─────────────────────────────────────────┤
│       Entities Layer                    │  ← Modelos de TypeORM
├─────────────────────────────────────────┤
│         Database                        │  ← PostgreSQL
└─────────────────────────────────────────┘
```

### Principios de Diseño
- **Separation of Concerns**: Cada capa tiene responsabilidades específicas
- **Dependency Injection**: Services inyectados en controllers
- **Single Responsibility**: Cada módulo/clase tiene una única razón para cambiar
- **DRY (Don't Repeat Yourself)**: Código reutilizable en utils y middlewares

---

## 🛠️ Stack Tecnológico

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **TypeScript** | 5.x | Tipado estático |
| **Express** | 4.x | Framework web |
| **TypeORM** | 0.3.x | ORM para base de datos |
| **PostgreSQL** | 14+ | Base de datos relacional |

### Librerías Principales
| Librería | Propósito |
|----------|-----------|
| `jsonwebtoken` | Generación y verificación de JWT |
| `bcryptjs` | Hash de contraseñas |
| `express-validator` | Validación de requests |
| `cors` | Manejo de CORS |
| `morgan` | Logging de HTTP requests |
| `dotenv` | Variables de entorno |

---

## 📁 Estructura del Proyecto

```
init-node/
├── src/
│   ├── config/          # Configuraciones
│   │   ├── database.ts  # Configuración de TypeORM
│   │   └── env.ts       # Variables de entorno
│   │
│   ├── controllers/     # Controllers (Request/Response)
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   └── dashboard.controller.ts
│   │
│   ├── entities/        # Modelos de TypeORM
│   │   ├── User.entity.ts
│   │   └── Product.entity.ts
│   │
│   ├── middlewares/     # Middlewares
│   │   ├── auth.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── migrations/      # Migraciones de base de datos
│   │   └── *.ts
│   │
│   ├── routes/          # Definición de rutas
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   └── dashboard.routes.ts
│   │
│   ├── services/        # Lógica de negocio
│   │   ├── auth.service.ts
│   │   └── product.service.ts
│   │
│   ├── utils/           # Utilidades
│   │   ├── jwt.util.ts
│   │   └── password.util.ts
│   │
│   ├── validators/      # Validaciones
│   │   ├── auth.validator.ts
│   │   └── product.validator.ts
│   │
│   └── index.ts         # Punto de entrada
│
├── database/
│   └── schema.sql       # Script SQL de la base de datos
│
├── .env.example         # Ejemplo de variables de entorno
├── package.json         # Dependencias del proyecto
├── tsconfig.json        # Configuración de TypeScript
└── README.md            # Documentación de usuario
```

---

## 💾 Base de Datos

### Diagrama Entidad-Relación

```
┌─────────────────────────┐
│       USERS             │
├─────────────────────────┤
│ id: UUID (PK)          │
│ nombre: VARCHAR(255)    │
│ email: VARCHAR(255) UK  │
│ password: VARCHAR(255)  │
│ role: ENUM(admin,user)  │
│ created_at: TIMESTAMP   │
│ updated_at: TIMESTAMP   │
└─────────────────────────┘

┌─────────────────────────┐
│      PRODUCTS           │
├─────────────────────────┤
│ id: UUID (PK)          │
│ nombre: VARCHAR(255)    │
│ precio: DECIMAL(10,2)   │
│ descripcion: TEXT       │
│ fecha_elaboracion: TS   │
│ fecha_vencimiento: TS   │
│ imageUrl: TEXT          │
│ created_at: TIMESTAMP   │
│ updated_at: TIMESTAMP   │
└─────────────────────────┘
```

### Índices
- **users.email**: Búsquedas rápidas por email
- **products.nombre**: Búsquedas case-insensitive por nombre
- **products.fecha_vencimiento**: Filtrado por fechas de vencimiento

### Constraints
- **users.email**: UNIQUE - No se permiten emails duplicados
- **products.precio**: CHECK (precio >= 0) - Precio no negativo
- **products.fecha_vencimiento**: CHECK (fecha_vencimiento > fecha_elaboracion)

---

## 🔐 Autenticación y Seguridad

### Sistema de Autenticación
Implementa **JWT (JSON Web Tokens)** con doble token:

#### Access Token
- **Secret**: `JWT_SECRET`
- **Duración**: 24 horas (configurable)
- **Uso**: Autenticación de requests
- **Payload**:
  ```json
  {
    "userId": "uuid",
    "email": "user@example.com",
    "role": "admin"
  }
  ```

#### Refresh Token
- **Secret**: `JWT_REFRESH_SECRET` (diferente del access token)
- **Duración**: 7 días (configurable)
- **Uso**: Renovar access token sin re-login

### Flujo de Autenticación

```
1. LOGIN
   Client → POST /api/auth/login { email, password }
   Server → Valida credenciales
   Server → Genera access_token + refresh_token
   Server → Response: { user, accessToken, refreshToken }

2. REQUEST AUTENTICADO
   Client → GET /api/auth/me
            Header: Authorization: Bearer {accessToken}
   Server → Middleware valida token
   Server → Agrega req.user con datos del usuario
   Server → Controller procesa request

3. TOKEN EXPIRADO
   Client → Request con token expirado
   Server → 401 "Token expirado"
   Client → POST /api/auth/refresh { refreshToken }
   Server → Genera nuevos tokens
   Server → Response: { accessToken, refreshToken }
```

### Hash de Contraseñas
- **Algoritmo**: bcrypt
- **Salt Rounds**: 10
- **Verificación**: Nunca se almacenan contraseñas en texto plano

### Middleware de Autenticación
```typescript
// src/middlewares/auth.middleware.ts
export const authenticate = async (req, res, next) => {
  // 1. Extrae token del header Authorization
  // 2. Verifica token con JWT_SECRET
  // 3. Agrega req.user con datos del token
  // 4. Continúa al siguiente middleware
};
```

---

## 🔌 API Endpoints

### Autenticación

#### POST `/api/auth/register`
Registra un nuevo usuario.

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Secret123",
  "role": "user"  // opcional: "admin" | "user"
}
```

**Response (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "role": "user"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

#### POST `/api/auth/login`
Inicia sesión de un usuario existente.

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "Secret123"
}
```

**Response (200):**
```json
{
  "message": "Login exitoso",
  "user": { ... },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

#### POST `/api/auth/refresh`
Renueva el access token usando el refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

**Response (200):**
```json
{
  "message": "Token actualizado exitosamente",
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

---

#### GET `/api/auth/me` 🔒
Obtiene el usuario autenticado actual.

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "role": "user"
  }
}
```

---

### Productos

#### GET `/api/products`
Lista productos con paginación y búsqueda.

**Query Parameters:**
- `page` (number): Número de página (default: 1)
- `limit` (number): Productos por página (default: 10, max: 100)
- `search` (string): Búsqueda por nombre (case-insensitive)
- `sortBy` (string): Campo para ordenar (default: createdAt)
- `order` (string): asc | desc (default: DESC)

**Response (200):**
```json
{
  "products": [
    {
      "id": "uuid",
      "nombre": "Paracetamol 500mg",
      "precio": 15000,
      "descripcion": "...",
      "fechaElaboracion": "2024-01-15T00:00:00.000Z",
      "fechaVencimiento": "2026-01-15T00:00:00.000Z",
      "imageUrl": "https://...",
      "createdAt": "2024-11-09T...",
      "updatedAt": "2024-11-09T..."
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

---

#### GET `/api/products/:id`
Obtiene un producto por ID.

**Response (200):**
```json
{
  "product": { ... }
}
```

---

#### POST `/api/products`
Crea un nuevo producto.

**Request Body:**
```json
{
  "nombre": "Ibuprofeno 400mg",
  "precio": 20000,
  "descripcion": "Antiinflamatorio...",
  "fechaElaboracion": "2024-02-01T00:00:00.000Z",
  "fechaVencimiento": "2026-02-01T00:00:00.000Z",
  "imageUrl": "https://..." // o "data:image/jpeg;base64,..."
}
```

**Response (201):**
```json
{
  "message": "Producto creado exitosamente",
  "product": { ... }
}
```

---

#### PUT `/api/products/:id`
Actualiza un producto existente.

**Request Body:** (todos los campos opcionales)
```json
{
  "nombre": "Nuevo nombre",
  "precio": 25000
}
```

**Response (200):**
```json
{
  "message": "Producto actualizado exitosamente",
  "product": { ... }
}
```

---

#### DELETE `/api/products/:id`
Elimina un producto.

**Response (200):**
```json
{
  "message": "Producto eliminado exitosamente"
}
```

---

### Dashboard

#### GET `/api/dashboard/stats`
Obtiene estadísticas del inventario.

**Response (200):**
```json
{
  "stats": {
    "totalProducts": 50,
    "expiringProducts": 5,
    "expiredProducts": 2,
    "totalInventoryValue": 1500000
  }
}
```

---

## 📊 Modelos de Datos

### User Entity
```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

### Product Entity
```typescript
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'timestamp', name: 'fecha_elaboracion' })
  fechaElaboracion: Date;

  @Column({ type: 'timestamp', name: 'fecha_vencimiento' })
  fechaVencimiento: Date;

  @Column({ type: 'text', nullable: true })
  imageUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## ✅ Validaciones

### Validación de Registro
```typescript
registerValidation = [
  body('nombre').trim().notEmpty().isLength({ min: 2, max: 255 }),
  body('email').trim().isEmail().normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('role').optional().isIn(['admin', 'user'])
]
```

### Validación de Productos
```typescript
createProductValidation = [
  body('nombre').trim().notEmpty().isLength({ min: 3, max: 255 }),
  body('precio').isNumeric().isFloat({ min: 0 }),
  body('descripcion').trim().notEmpty().isLength({ min: 10 }),
  body('fechaElaboracion').isISO8601(),
  body('fechaVencimiento')
    .isISO8601()
    .custom((venc, { req }) => {
      // Validar que fecha_vencimiento > fecha_elaboracion
    }),
  body('imageUrl')
    .optional()
    .custom((value) => {
      // Validar URL o Base64
    })
]
```

---

## ⚙️ Configuración

### Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=igloolab

# JWT
JWT_SECRET=your_jwt_secret_change_in_production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your_refresh_secret_change_in_production
JWT_REFRESH_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### TypeORM Configuration
```typescript
// src/config/database.ts
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [User, Product],
  migrations: ['src/migrations/**/*.ts'],
  synchronize: env.NODE_ENV === 'development',
  logging: env.NODE_ENV === 'development'
});
```

---

## 🚀 Despliegue

### Producción
1. Desactivar `synchronize` en TypeORM
2. Usar migraciones para cambios en DB
3. Configurar variables de entorno seguras
4. Habilitar HTTPS
5. Configurar rate limiting
6. Implementar monitoring y logging

### Recomendaciones
- **Hosting**: Heroku, Railway, AWS, DigitalOcean
- **Base de Datos**: PostgreSQL gestionado (AWS RDS, Heroku Postgres)
- **Secrets**: Nunca commitear `.env` al repositorio
- **CORS**: Configurar dominios específicos en producción

---

## 📝 Notas Adicionales

### Límites de Payload
- **JSON**: 10MB (para soportar imágenes Base64)
- **URL Encoded**: 10MB

### Búsqueda de Productos
- **Case-insensitive**: Usa `ILike` en TypeORM
- **Optimizada**: Con índice en `LOWER(nombre)`

### Gestión de Imágenes
Soporta dos formatos:
1. **URL**: `https://example.com/image.jpg`
2. **Base64**: `data:image/jpeg;base64,/9j/4AAQ...`

---

**Última actualización**: Noviembre 2024  
**Versión**: 1.0.0
