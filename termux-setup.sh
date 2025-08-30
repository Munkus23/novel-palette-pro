#!/bin/bash
# Termux setup script for MangaEdit Pro
# Run this script to set up the development environment in Termux

echo "🚀 Setting up MangaEdit Pro for Termux..."

# Update package repositories
pkg update -y
pkg upgrade -y

# Install essential packages for Node.js development
echo "📦 Installing essential packages..."
pkg install -y nodejs npm git python make clang

# Install additional tools that might be needed
pkg install -y which curl wget

# Set up proper npm configuration for Termux
echo "⚙️ Configuring npm for Termux..."
npm config set python python3
npm config set prefer-offline true
npm config set audit false

# Create .npmrc file for Termux compatibility
echo "registry=https://registry.npmjs.org/" > .npmrc
echo "audit=false" >> .npmrc
echo "fund=false" >> .npmrc

# Install dependencies
echo "📦 Installing project dependencies..."
npm install --legacy-peer-deps

echo "✅ Setup complete! You can now run:"
echo "   npm run dev     - Start development server"
echo "   npm run build   - Build for production"
echo "   npm run preview - Preview production build"

# Make the script executable
chmod +x termux-build.sh