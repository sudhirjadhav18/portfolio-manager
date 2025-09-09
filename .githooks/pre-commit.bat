@echo off
REM Pre-commit hook to run linting and formatting checks (Windows)

echo Running pre-commit checks...

REM Check if we're in the frontend directory
if exist "frontend" (
    echo Checking frontend...
    cd frontend
    
    REM Run ESLint
    npm run lint
    if %errorlevel% neq 0 (
        echo ❌ ESLint checks failed. Please fix the issues before committing.
        exit /b 1
    )
    
    cd ..
)

REM Check if we're in the backend directory
if exist "backend" (
    echo Checking backend...
    cd backend
    
    REM Run TypeScript check
    npm run build
    if %errorlevel% neq 0 (
        echo ❌ TypeScript compilation failed. Please fix the issues before committing.
        exit /b 1
    )
    
    cd ..
)

echo ✅ Pre-commit checks passed!
exit /b 0
