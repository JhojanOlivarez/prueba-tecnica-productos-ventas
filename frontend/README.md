## Frontend – Productos & Ventas App

Aplicación web construida con React + TypeScript + Vite, totalmente integrada con el backend en .NET, diseñada para administrar categorías, productos y ventas, con autenticación JWT, dashboard con métricas y CRUDs completos.

Tecnologías principales

React 18 + TypeScript

Vite

Axios

React Router v6

Context API

CSS modular

LocalStorage

## Estructura del proyecto

frontend/
│── public/
│── src/
│   ├── api/
│   │   └── client.ts
│   ├── assets/
│   ├── components/
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── categories/
│   │   │   ├── CategoriesListPage.tsx
│   │   │   └── CategoryFormPage.tsx
│   │   ├── sales/
│   │   │   ├── SalesListPage.tsx
│   │   │   └── CreateSalePage.tsx
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│── .env
│── package.json
│── tsconfig.json
│── vite.config.ts

Instalación
1. Clonar el repositorio
git clone https://github.com/tu-repo.git
cd frontend

2. Instalar dependencias
npm install

3. Crear archivo .env
VITE_API_URL=http://localhost:5014

4. Ejecutar modo desarrollo
npm run dev

5. Build producción
npm run build

6. Previsualizar build
npm run preview

Autenticación (JWT)

El token JWT se guarda en localStorage y se agrega automáticamente a cada petición gracias al interceptor:

config.headers.Authorization = `Bearer ${token}`;

Integración con Backend
Auth

POST /api/auth/login

POST /api/auth/register

Categories

GET /api/categories

POST /api/categories

PUT /api/categories/{id}

DELETE /api/categories/{id}

Products

GET /api/products

POST /api/products

Sales

GET /api/sales

POST /api/sales

GET /api/sales/report

Características principales

## Autenticación completa

Login

Logout

Persistencia de sesión

## Dashboard profesional

Total de ventas

Total productos

Total categorías

Gráfica de ventas por fecha

Últimas ventas

## CRUD de categorías

Crear / editar / eliminar / listar

## Gestión de productos

Creación rápida

## Listado dinámico

 Gestión de ventas

Registro con múltiples ítems

Cálculo automático

Historial completo