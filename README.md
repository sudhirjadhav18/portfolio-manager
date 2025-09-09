# Portfolio Manager

A full-stack portfolio management application built with React, TypeScript, Node.js, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL (local or cloud)

### Setup
```bash
# Clone and setup everything (recommended)
git clone <repository-url>
cd portfolio-manager
npm run setup
```

This will install dependencies and configure git hooks automatically.

### Environment Setup
Create `backend/.env`:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public"
JWT_SECRET="change-me"
PORT=4000
```

### Database Setup
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### Run Development Servers
```bash
# Terminal 1 - Backend
npm run dev:backend  # http://localhost:4000

# Terminal 2 - Frontend  
npm run dev:frontend # http://localhost:5173
```

## 📁 Project Structure

```
portfolio-manager/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Node.js + Express + Prisma
├── .githooks/         # Git hooks for commit validation
└── scripts/           # Setup automation scripts
```

## 🔧 Development

### Available Scripts
- `npm run setup` - Install dependencies and configure git hooks
- `npm run dev` - Run both frontend and backend concurrently
- `npm run build` - Build both frontend and backend
- `npm run lint` - Run linting on both projects

### Git Hooks
Automated commit validation ensures:
- ✅ Conventional commit format
- ✅ Issue references required
- ✅ Code quality checks (ESLint, TypeScript compilation)

## 📚 Documentation

- **[Setup Guide](SETUP-GUIDE.md)** - Detailed setup instructions
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute
- **[Frontend README](frontend/README.md)** - Frontend-specific documentation

## 🛠️ Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite (build tool)
- React Router (routing)
- Axios (HTTP client)

**Backend:**
- Node.js + Express
- TypeScript
- Prisma (ORM)
- PostgreSQL (database)
- JWT (authentication)

## 📖 API Reference

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
