@echo off
REM Setup script to configure git hooks for portfolio-manager (Windows)
REM Run this script after cloning the repository

echo 🔧 Setting up git hooks for portfolio-manager...

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Not in a git repository!
    echo Please run this script from the root of your cloned repository.
    pause
    exit /b 1
)

REM Check if .githooks directory exists
if not exist ".githooks" (
    echo ❌ Error: .githooks directory not found!
    echo Please make sure you're in the correct repository directory.
    pause
    exit /b 1
)

REM Configure git to use the .githooks directory
echo 📝 Configuring git hooks path...
git config core.hooksPath .githooks

REM Verify the configuration
echo ✅ Verifying configuration...
git config core.hooksPath > temp_hooks_path.txt
set /p hooks_path=<temp_hooks_path.txt
del temp_hooks_path.txt

if "%hooks_path%"==".githooks" (
    echo ✅ Git hooks configured successfully!
    echo.
    echo 📋 Commit message format requirements:
    echo    ^<type^>^(scope^): short description ^(fixes^|closes^|resolves #123^)
    echo.
    echo 📝 Examples:
    echo    feat^(auth^): add login with Supabase ^(fixes #12^)
    echo    fix^(ui^): correct button alignment ^(closes #34^)
    echo    chore^(ci^): update pipeline script ^(resolves #56^)
    echo.
    echo 🎉 You're all set! The hooks will now run automatically on commits.
) else (
    echo ❌ Configuration failed. Please run the command manually:
    echo    git config core.hooksPath .githooks
    pause
    exit /b 1
)

pause
