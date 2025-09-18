# Interview Management System

A full-stack application for managing employees and interviews, built as a monorepo.

## 🏗️ Architecture

- **Frontend**: Vue.js 3 + Vuetify + TypeScript
- **Backend**: NestJS + TypeScript + Prisma
- **Database**: PostgreSQL
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker & Docker Compose

### Quick Start

1. **Clone and install dependencies**

   ```bash
   git clone https://github.com/maxVite/interviews
   cd interview
   pnpm install
   ```

2. **Set up environment variables**

   ```bash
   # Create environment files
   cp .env.example .env
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```

3. **Start with Docker (Recommended)**

   ```bash
   docker-compose up --build
   ```

4. **Or start development servers locally**

   > **Note**: When running servers locally, you'll need to adjust the database URLs in your environment files to point to `localhost` instead of the Docker service names.

   ```bash
   # Terminal 1: Database
   docker-compose up db -d

   # Terminal 2: Backend
   cd server && pnpm start:dev

   # Terminal 3: Frontend
   cd client && pnpm dev
   ```

5. **Seed the database (Optional)**

   The project includes a seed script to populate the database with sample data:

   ```bash
   # If using Docker:
   docker-compose exec server pnpm add -D tsx
   docker-compose exec server npx tsx prisma/seed.ts

   # If running locally:
   cd server && pnpm db:seed
   ```

### Access URLs

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **Database Admin**: http://localhost:8080

## 📋 Features

- **Employee Management**: Create, read, update, and delete employee records
- **Interview Scheduling**: Assign interviews to employees with status tracking
- **Real-time Search**: Server-side filtering for better performance
- **Form Validation**: Comprehensive input validation with clear error messages
- **Responsive Design**: Modern UI with Vuetify components

## 🛠️ Design Decisions

### Backend

- **NestJS**: Chosen for excellent CLI tooling, good documentation, and reduced boilerplate code
- **Prisma**: Selected for easy DTO generation, migrations, and straightforward queries
- **Server-side search**: Implemented filtering on the backend for better performance instead of client-side filtering
- **Validation**: Custom DTOs with class-validator for robust input validation

### Frontend

- **Vue.js 3 + Composition API**: Modern reactive framework with TypeScript support
- **Vuetify**: Material Design components for consistent UI/UX
- **TanStack Query**: Data fetching and caching instead of relying solely on Pinia stores
- **Pinia**: State management for client-specific state (UI state, user preferences)

### API Design

- **RESTful endpoints**: Following REST conventions for predictable API behavior
- **Embedded data**: `GET /api/employees/:id` includes interviews to avoid extra requests

### Tools

- **pnpm**: Better performance and efficient disk usage compared to npm
- **pnpm Workspace**: Simplified dependency management and consistent tooling across packages
- **Docker**: Containerized services for consistent development and deployment environments

## 🔄 Possible Improvements

Given more time, the following enhancements would be valuable:

### Performance & UX

- **Debounced search**: Implement `useDebounce` hook for search input to reduce API calls
- **Pagination**: Add pagination for large datasets
- **Loading states**: Enhanced loading indicators and skeleton screens

### Architecture

- **Shared contracts**: Use tools like ts-rest for type-safe API contracts or OpenAPI + Orval for auto-generated typed clients to avoid type duplication between frontend and backend

### Features

- **Internationalization**: Multi-language support with vue-i18n
- **Authentication & Authorization**: User management with JWT tokens and role-based access control
- **Advanced filtering**: Date ranges, status filters, and sorting options
- **Interview Status Management**: Update interview status (scheduled, completed, cancelled) with workflow tracking

## 📁 Project Structure

```
interview/
├── client/                 # Vue.js frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Route components
│   │   ├── composables/    # Vue composition functions
│   │   ├── stores/         # Pinia stores
│   │   └── services/       # API services
│   └── Dockerfile
├── server/                 # NestJS backend
│   ├── src/
│   │   ├── employees/      # Employee module
│   │   ├── interviews/     # Interview module
│   │   └── prisma/         # Database service
│   ├── prisma/             # Database schema & migrations
│   └── Dockerfile
├── docker-compose.yml      # Service orchestration
└── package.json           # Monorepo configuration
```

## 🧪 Testing

```bash
# E2E tests
cd server && pnpm test:e2e

```
