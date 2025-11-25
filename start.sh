#!/bin/bash

echo "🚀 Die Menschenfotografin - Portfolio Setup"
echo "==========================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if install was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Dependencies installed successfully"
    echo ""
    echo "🎨 Starting development server..."
    echo ""
    npm run dev
else
    echo ""
    echo "❌ Installation failed. Please check errors above."
    exit 1
fi
