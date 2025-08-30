#!/bin/bash
# Termux build script for MangaEdit Pro
# Optimized build process for Android/Termux environment

echo "🔨 Building MangaEdit Pro in Termux..."

# Set Node.js memory limit for Termux (limited RAM)
export NODE_OPTIONS="--max-old-space-size=2048"

# Clear any previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.vite/

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Build the project
echo "⚡ Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build files are in: ./dist/"
    echo "🌐 You can serve the build with: npm run preview"
    
    # Show build size
    if command -v du &> /dev/null; then
        echo "📊 Build size: $(du -sh dist/ | cut -f1)"
    fi
else
    echo "❌ Build failed!"
    exit 1
fi