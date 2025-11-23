#!/bin/bash

# Script to update OpenAI API Key

echo "🔑 Update OpenAI API Key"
echo "========================"
echo ""
echo "Enter your new OpenAI API key:"
read -s NEW_KEY

if [ -z "$NEW_KEY" ]; then
  echo "❌ No key entered. Exiting."
  exit 1
fi

echo "VITE_OPENAI_API_KEY=$NEW_KEY" > .env.local

echo ""
echo "✅ API key updated in .env.local"
echo ""
echo "🔄 Restart your dev server with: npm run dev"
echo ""


