# Portfolio Manager

## 🚀 Setup & Run

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL (local or cloud)

### 1) Install dependencies & Setup Git Hooks
```bash
# From repo root - Automated setup (recommended)
npm run setup

# OR Manual setup
cd backend && npm install
cd ../frontend && npm install
npm run setup:hooks
```

**🔧 Git Hooks Setup**: The automated setup configures git hooks for commit message validation. If you prefer manual setup:
- **Windows**: Run `setup-hooks.bat`
- **Unix/Linux/Mac**: Run `./setup-hooks.sh`
- **Node.js**: Run `npm run setup:hooks`

### 2) Configure backend environment
Create `backend/.env` with:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public"
JWT_SECRET="change-me"
PORT=4000
```

Notes:
- Backend CORS is configured for `http://localhost:5173` (Vite dev server).
- Ensure the database exists before running migrations.

### 3) Setup database (Prisma)
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
# If applying existing migrations in non-dev environments:
# npx prisma migrate deploy
```

### 4) Run the apps
```bash
# Terminal A - backend
cd backend
npm run dev  # http://localhost:4000

# Terminal B - frontend
cd frontend
npm run dev  # http://localhost:5173
```

The frontend will call the backend at `http://localhost:4000`. Make sure both are running.

### 5) Auth endpoints (quick reference)
- POST `/api/auth/register` → `{ email, name, password }`
- POST `/api/auth/login` → `{ email, password }` (sets httpOnly cookie)
- GET `/api/auth/me` (requires cookie)
- POST `/api/auth/logout`

---

# 📌 Commit Message Conventions & Git Hooks

We follow the **Conventional Commits** standard with **automated validation** to keep commit history clean and meaningful.

## 🔧 Git Hooks Setup

Git hooks are automatically configured during setup to enforce commit message conventions. The hooks will:

- ✅ **Validate commit message format** (conventional commits)
- ✅ **Require issue references** (fixes|closes|resolves #123)
- ✅ **Run pre-commit checks** (linting, TypeScript compilation)

### Manual Hook Setup (if needed)
```bash
# Configure git to use project hooks
git config core.hooksPath .githooks

# Make hooks executable (Unix systems)
chmod +x .githooks/*
```

### Commit Message Requirements

**Format**: `<type>(scope): short description (fixes|closes|resolves #123)`

**Required Elements**:
- ✅ Conventional commit type (feat, fix, docs, etc.)
- ✅ Issue reference (fixes|closes|resolves #number)
- ✅ Descriptive message (max 50 characters)

---

## ✅ Format
```
<type>(scope): short description
```
- **type** → kind of change (feat, fix, docs, etc.)
- **scope** → area of codebase (optional, e.g. `auth`, `ui`, `db`)
- **description** → brief summary (max ~50 chars)

---

## 🔑 Types
- **feat** → a new feature  
- **fix** → a bug fix  
- **docs** → documentation changes only  
- **style** → code style/formatting (no logic changes)  
- **refactor** → code restructuring without changing behavior  
- **test** → adding/fixing tests  
- **chore** → build tools, dependencies, configs  

---

## 📝 Examples

### Features
```
feat(auth): add login with Supabase
feat(ui): implement responsive navbar
```

### Bug Fixes
```
fix(auth): handle invalid password error
fix(api): correct 500 error handling
```

### Documentation
```
docs(readme): update setup instructions
docs(contributing): add commit guidelines
```

### Refactor / Style
```
refactor(db): optimize query for fetching users
style(ui): fix button alignment and spacing
```

### Tests
```
test(auth): add unit tests for login API
test(ui): snapshot tests for navbar
```

### Chores
```
chore(deps): upgrade React to 18.3
chore(lint): add eslint config for project
```

---

📖 More info → [Conventional Commits](https://www.conventionalcommits.org)
