#!/bin/bash

# Quick Start Script for Queue System API
# This script helps you quickly test the API locally

echo "🚀 Queue System API - Quick Start"
echo "================================="
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check for .env file
if [ ! -f ".env" ]; then
    echo "📋 Creating .env from .env.example..."
    cp .env.example .env
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Available Commands:"
echo "  1. Start API Server:      python app.py"
echo "  2. Run API Tests:         python tests/test_api.py"
echo ""
echo "🌐 Starting API Server..."
echo "   Configure HOST and PORT in .env file"
echo "   Press Ctrl+C to stop"
echo ""

# Start the Flask server
python app.py
