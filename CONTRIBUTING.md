# 🌿 Contributing Guide

This document describes how to contribute to this repository.

---

## 🔑 Rules
- **One Issue → One Branch → One Pull Request (PR)**
- Always create a branch from the latest `main`
- Branch names must include the issue number and a short description
- Use lowercase, hyphen-separated names (no spaces, no underscores)

---

## 📌 Branch Naming Pattern

```
<type>/<ISSUE-NUMBER>-<short-description>
```

### Types
- `feature/` → new features, enhancements
- `fix/` → bug fixes
- `chore/` → maintenance tasks (deps, configs, formatting)
- `docs/` → documentation updates
- `hotfix/` → urgent fixes on production

### Examples
- `feature/123-add-login-api`
- `fix/87-navbar-overflow`
- `chore/45-update-dependencies`
- `docs/99-readme-instructions`
- `hotfix/200-critical-auth-bug`

---

## 🌐 Main Branches
- `main` → always stable, deployable code  
- *(optional)* `develop` → integration branch for larger teams.  
  > For solo/small projects, `main` is enough.

---

## 🚀 Workflow Example

1. **Create branch from `main`**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/123-add-login-api
   ```

2. **Commit changes**
   ```bash
   git add .
   git commit -m "feat(auth): add login API"
   ```

3. **Push branch**
   ```bash
   git push -u origin feature/123-add-login-api
   ```

4. **Open PR**
   - PR title: `feat(auth): add login API`
   - PR body:  
     ```
     Fixes #123
     - Added login endpoint
     - Validated credentials with Supabase
     ```

5. **Merge PR**
   - Prefer **Squash and Merge** for clean history

6. **Delete branch**
   ```bash
   git branch -d feature/123-add-login-api
   git push origin --delete feature/123-add-login-api
   ```

---

---

## 📝 Commit Message Conventions

We follow **Conventional Commits** with automated validation. All commits must:

### Required Format
```
<type>(scope): short description (fixes|closes|resolves #123)
```

### Commit Types
- **feat** → new features
- **fix** → bug fixes  
- **docs** → documentation changes
- **style** → code formatting (no logic changes)
- **refactor** → code restructuring
- **test** → adding/fixing tests
- **chore** → build tools, dependencies, configs

### Examples
```bash
feat(auth): add login with Supabase (fixes #12)
fix(ui): correct button alignment (closes #34)
chore(deps): upgrade React to 18.3 (resolves #56)
```

### Validation
- ✅ Conventional commit format enforced
- ✅ Issue references required (fixes|closes|resolves #number)
- ✅ Pre-commit checks run automatically (ESLint, TypeScript)

---

## 📝 Notes
- Use `Fixes #<issue-number>` in PR descriptions to auto-close issues on merge.
- Keep branch names short but descriptive.
- Avoid committing directly to `main`.
- All commits are automatically validated by git hooks.
