# portfolio-manager

# 📌 Commit Message Conventions & Setup

We follow the **Conventional Commits** standard to keep commit history clean and meaningful.

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
