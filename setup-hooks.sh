#!/bin/bash

# Setup script to configure git hooks for portfolio-manager
# Run this script after cloning the repository

echo "🔧 Setting up git hooks for portfolio-manager..."

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository!"
    echo "Please run this script from the root of your cloned repository."
    exit 1
fi

# Check if .githooks directory exists
if [ ! -d ".githooks" ]; then
    echo "❌ Error: .githooks directory not found!"
    echo "Please make sure you're in the correct repository directory."
    exit 1
fi

# Configure git to use the .githooks directory
echo "📝 Configuring git hooks path..."
git config core.hooksPath .githooks

# Make hooks executable
echo "🔐 Making hooks executable..."
chmod +x .githooks/*

# Verify the configuration
echo "✅ Verifying configuration..."
hooks_path=$(git config core.hooksPath)
if [ "$hooks_path" = ".githooks" ]; then
    echo "✅ Git hooks configured successfully!"
    echo ""
    echo "📋 Commit message format requirements:"
    echo "   <type>(scope): short description (fixes|closes|resolves #123)"
    echo ""
    echo "📝 Examples:"
    echo "   feat(auth): add login with Supabase (fixes #12)"
    echo "   fix(ui): correct button alignment (closes #34)"
    echo "   chore(ci): update pipeline script (resolves #56)"
    echo ""
    echo "🎉 You're all set! The hooks will now run automatically on commits."
else
    echo "❌ Configuration failed. Please run the command manually:"
    echo "   git config core.hooksPath .githooks"
    exit 1
fi
