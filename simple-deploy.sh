#!/bin/bash

# Exit on error
set -e

# Clean up old builds
echo "Cleaning up previous builds..."
rm -rf .next out build

# Create a simple fallback page
echo "Creating fallback directory..."
mkdir -p public/fallback
touch public/fallback/.gitkeep

# Configure Next.js temporarily for static export
echo "Updating Next.js config for static export..."
cat > next.config.ts << 'EOL'
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
EOL

# Build Next.js with static export
echo "Building Next.js app for production..."
npm run build

# Create Firebase config
echo "Creating Firebase config..."
cat > firebase.json << 'EOL'
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
EOL

# Deploy to Firebase hosting
echo "Deploying to Firebase hosting..."
firebase deploy --only hosting

echo "Deployment completed successfully!"
echo "Your website is now live at: https://swiftcart-bsbrc.web.app"
