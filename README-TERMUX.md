# MangaEdit Pro - Termux Build Guide

This guide helps you build and run MangaEdit Pro in Termux on Android.

## Quick Setup

1. **Install Termux** from F-Droid (recommended) or Google Play Store

2. **Clone the repository:**
   ```bash
   git clone https://github.com/Munkus23/Mangaz.git
   cd Mangaz
   ```

3. **Run the setup script:**
   ```bash
   chmod +x termux-setup.sh
   ./termux-setup.sh
   ```

4. **Start development:**
   ```bash
   ./termux-dev.sh
   ```

## Manual Setup (if script fails)

1. **Update Termux packages:**
   ```bash
   pkg update && pkg upgrade
   ```

2. **Install Node.js and dependencies:**
   ```bash
   pkg install nodejs npm git python make clang
   ```

3. **Configure npm for Termux:**
   ```bash
   npm config set python python3
   npm config set audit false
   ```

4. **Install project dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

## Building the Project

### Development Build
```bash
npm run dev
# or use the optimized script:
./termux-dev.sh
```

### Production Build
```bash
npm run build
# or use the optimized script:
./termux-build.sh
```

### Preview Production Build
```bash
npm run preview
```

## Termux-Specific Optimizations

- **Memory Management**: Scripts set appropriate Node.js memory limits for mobile devices
- **Network Access**: Development server configured to allow network access from other devices
- **Build Optimization**: Disabled audit and funding checks for faster installations
- **Native Modules**: Proper Python configuration for packages requiring compilation

## Troubleshooting

### Common Issues

1. **Out of Memory Errors:**
   ```bash
   export NODE_OPTIONS="--max-old-space-size=1024"
   ```

2. **Permission Denied:**
   ```bash
   chmod +x *.sh
   ```

3. **npm Install Fails:**
   ```bash
   npm install --legacy-peer-deps --no-audit
   ```

4. **Python Not Found:**
   ```bash
   pkg install python
   npm config set python python3
   ```

### Storage Management

- **Clear npm cache:** `npm cache clean --force`
- **Clear Vite cache:** `rm -rf node_modules/.vite`
- **Check disk space:** `df -h`

## Development Tips

1. **Use network IP** to test on other devices connected to the same WiFi
2. **Enable storage permission** in Termux settings for file access
3. **Use external keyboard** for better coding experience
4. **Install Termux:Widget** for quick script access from home screen

## Building APK (Capacitor)

After setting up the web build:

1. **Install Java and Android SDK:**
   ```bash
   pkg install openjdk-17 android-tools
   ```

2. **Add Android platform:**
   ```bash
   npx cap add android
   ```

3. **Build and sync:**
   ```bash
   npm run build
   npx cap sync android
   ```

4. **Open in Android Studio** (if available) or build via command line

## Performance Tips

- Close unnecessary apps to free up RAM
- Use `--legacy-peer-deps` for faster installs
- Enable swap file if building large projects
- Use `npm ci` instead of `npm install` for faster CI builds

## Support

If you encounter issues specific to Termux, check:
- [Termux Wiki](https://wiki.termux.com/)
- [Termux GitHub Issues](https://github.com/termux/termux-app/issues)
- [Node.js in Termux Guide](https://wiki.termux.com/wiki/Node.js)