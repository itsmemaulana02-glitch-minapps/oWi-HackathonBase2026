#!/bin/bash

# OWi - Local Development Setup Script
# =====================================

echo "🚀 OWi - Local Development Setup"
echo "================================="
echo ""

# Check Node.js version
NODE_VERSION=$(node -v 2>/dev/null)
if [ -z "$NODE_VERSION" ]; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
echo "✅ Node.js version: $NODE_VERSION"

# Check npm
NPM_VERSION=$(npm -v 2>/dev/null)
if [ -z "$NPM_VERSION" ]; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✅ npm version: $NPM_VERSION"

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo ""
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local - Please edit this file with your credentials"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Success message
echo ""
echo "================================="
echo "✅ Setup Complete!"
echo "================================="
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your Supabase credentials"
echo "2. Run the SQL scripts in Supabase SQL Editor:"
echo "   - scripts/001_create_tables.sql"
echo "   - scripts/002_create_triggers.sql"
echo "3. Start the development server: npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "For wallet setup:"
echo "- Install MetaMask extension"
echo "- Switch to Sepolia testnet"
echo "- Get test ETH from https://sepoliafaucet.com"
echo ""
echo "📖 See SETUP.md for detailed instructions"
