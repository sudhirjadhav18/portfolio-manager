#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up git hooks for portfolio-manager...');

// Check if we're in a git repository
try {
  execSync('git rev-parse --git-dir', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Error: Not in a git repository!');
  console.error('Please run this script from the root of your cloned repository.');
  process.exit(1);
}

// Check if .githooks directory exists
if (!fs.existsSync('.githooks')) {
  console.error('❌ Error: .githooks directory not found!');
  console.error('Please make sure you\'re in the correct repository directory.');
  process.exit(1);
}

try {
  // Configure git to use the .githooks directory
  console.log('📝 Configuring git hooks path...');
  execSync('git config core.hooksPath .githooks', { stdio: 'pipe' });

  // Make hooks executable (Unix-like systems)
  if (process.platform !== 'win32') {
    console.log('🔐 Making hooks executable...');
    execSync('chmod +x .githooks/*', { stdio: 'pipe' });
  } else {
    console.log('📝 Windows detected - using .bat hooks');
  }

  // Verify the configuration
  console.log('✅ Verifying configuration...');
  const hooksPath = execSync('git config core.hooksPath', { encoding: 'utf8' }).trim();

  if (hooksPath === '.githooks') {
    console.log('✅ Git hooks configured successfully!');
    console.log('');
    console.log('📋 Commit message format requirements:');
    console.log('   <type>(scope): short description (fixes|closes|resolves #123)');
    console.log('');
    console.log('📝 Examples:');
    console.log('   feat(auth): add login with Supabase (fixes #12)');
    console.log('   fix(ui): correct button alignment (closes #34)');
    console.log('   chore(ci): update pipeline script (resolves #56)');
    console.log('');
    console.log('🎉 You\'re all set! The hooks will now run automatically on commits.');
  } else {
    console.error('❌ Configuration failed. Please run the command manually:');
    console.error('   git config core.hooksPath .githooks');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error setting up git hooks:', error.message);
  process.exit(1);
}
