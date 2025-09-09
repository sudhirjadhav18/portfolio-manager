# 🚀 Detailed Setup Guide

This guide provides step-by-step instructions for setting up the Portfolio Manager project.

## 🎯 Quick Setup (Recommended)

For most users, the automated setup is sufficient:

```bash
git clone <repository-url>
cd portfolio-manager
npm run setup
```

This single command will:
- ✅ Install all dependencies (frontend + backend)
- ✅ Configure git hooks automatically
- ✅ Set up commit message validation
- ✅ Make hooks executable

## 🔧 Manual Setup Options

If the automated setup fails or you prefer manual control:

### Option 1: Node.js Script
```bash
npm run setup:hooks
```

### Option 2: Platform-Specific Scripts
```bash
# Windows
setup-hooks.bat

# Unix/Linux/Mac
./setup-hooks.sh
```

### Option 3: Manual Commands
```bash
# Configure git hooks
git config core.hooksPath .githooks

# Make hooks executable (Unix systems)
chmod +x .githooks/*

# Install dependencies
npm run install:all
```

## What the Git Hooks Do

### Pre-commit Hook
- Runs ESLint on frontend code
- Compiles TypeScript in backend
- Prevents commits with linting/compilation errors

### Commit-msg Hook
- Validates conventional commit format
- Requires issue references (fixes|closes|resolves #123)
- Enforces consistent commit message style

## Commit Message Format

**Required Format**: `<type>(scope): short description (fixes|closes|resolves #123)`

**Examples**:
```
feat(auth): add login with Supabase (fixes #12)
fix(ui): correct button alignment (closes #34)
chore(ci): update pipeline script (resolves #56)
```

## Troubleshooting

### Hooks Not Working
1. Verify configuration: `git config core.hooksPath`
2. Should return: `.githooks`
3. If not, run: `git config core.hooksPath .githooks`

### Permission Errors (Unix)
```bash
chmod +x .githooks/*
```

### Windows Issues
- Use `setup-hooks.bat` instead of shell scripts
- Ensure Git Bash or PowerShell is used

## 🔍 Verification

Test your setup with a sample commit:
```bash
git commit -m "test: verify git hooks setup (fixes #999)"
```

If hooks are working, you'll see validation messages and the commit will be rejected if format is incorrect.

## 🚨 Troubleshooting

### Common Issues

**Git Hooks Not Working**
1. Verify configuration: `git config core.hooksPath`
2. Should return: `.githooks`
3. If not, run: `git config core.hooksPath .githooks`

**Permission Errors (Unix)**
```bash
chmod +x .githooks/*
```

**Windows Issues**
- Use `setup-hooks.bat` instead of shell scripts
- Ensure Git Bash or PowerShell is used

**Build Errors**
- Ensure all dependencies are installed: `npm run install:all`
- Check Node.js version: `node --version` (should be 20+)
- Verify PostgreSQL is running and accessible

**Database Connection Issues**
- Check `backend/.env` file exists and has correct `DATABASE_URL`
- Ensure PostgreSQL is running
- Run `npx prisma generate` in backend directory

### Getting Help

If you encounter issues not covered here:
1. Check the [Contributing Guide](CONTRIBUTING.md)
2. Review the main [README](README.md)
3. Open an issue with detailed error information
