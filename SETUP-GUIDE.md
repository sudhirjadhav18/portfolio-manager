# 🚀 Quick Setup Guide for New Contributors

## Automated Setup (Recommended)

After cloning the repository, run:

```bash
# One command setup - installs dependencies and configures git hooks
npm run setup
```

This will:
- ✅ Install all dependencies (frontend + backend)
- ✅ Configure git hooks automatically
- ✅ Set up commit message validation
- ✅ Make hooks executable

## Manual Setup Options

If you prefer manual setup or the automated setup fails:

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

## Verification

Test your setup with a sample commit:
```bash
git commit -m "test: verify git hooks setup (fixes #999)"
```

If hooks are working, you'll see validation messages and the commit will be rejected if format is incorrect.
