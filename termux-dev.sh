#!/bin/bash
# Termux development server script
# Optimized for mobile development in Termux

echo "🚀 Starting development server in Termux..."

# Set Node.js options for Termux
export NODE_OPTIONS="--max-old-space-size=1024"

# Get local IP address for network access
LOCAL_IP=$(ip route get 8.8.8.8 | awk '{print $7; exit}' 2>/dev/null || echo "localhost")

echo "🌐 Server will be available at:"
echo "   Local:   http://localhost:8080"
echo "   Network: http://$LOCAL_IP:8080"
echo ""
echo "💡 To access from other devices on the same network, use the Network URL"
echo "🔄 Press Ctrl+C to stop the server"

# Start the development server
npm run dev -- --host 0.0.0.0 --port 8080