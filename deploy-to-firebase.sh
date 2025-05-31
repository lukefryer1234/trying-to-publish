#!/bin/bash

# Exit on error
set -e

# Clean up old builds
echo "Cleaning up previous builds..."
rm -rf .next out build

# Make sure all product pages will work in static export
echo "Adding fallback routes for dynamic pages..."
mkdir -p src/app/products/[productId]/fallback

# Build Next.js with static export
echo "Building Next.js app for production..."
npm run build

# Create routing files for SPA behavior
echo "Setting up SPA routing..."

# Create special file for handling client-side routing
cat > out/404.html << 'EOL'
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>SwiftCart</title>
    <script>
      // Single Page Apps for GitHub Pages or Firebase Hosting
      // Adapted from https://github.com/rafgraph/spa-github-pages
      // This script takes the current URL and converts the path and query
      // string into just a query string, and then redirects the browser
      // to the new URL with only a query string and hash fragment

      // If you're creating a Project Pages site and NOT using a custom domain,
      // then set pathSegmentsToKeep to 1 (enterprise users may need to set it to > 1).
      // This way the code will only replace the route part of the path, and not
      // the real directory in which the app resides, for example:
      // https://username.github.io/repo-name/one/two?a=b&c=d#qwe becomes
      // https://username.github.io/repo-name/?/one/two&a=b~and~c=d#qwe
      // Otherwise, leave pathSegmentsToKeep as 0.
      var pathSegmentsToKeep = 0;

      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>
EOL

# Update index.html to handle the redirect
if [ -f out/index.html ]; then
  echo "Updating index.html to handle redirects..."
  sed -i '/<head>/a \
  <script>\
    (function() {\
      // If returning to index page with a redirect parameter, convert it back to normal url\
      var l = window.location;\
      if (l.search && l.search.indexOf("?/") === 0) {\
        var decoded = l.search.slice(2);\
        var ampersandPosition = decoded.indexOf("&");\
        var queryParams = ampersandPosition === -1 ? "" : decoded.substring(ampersandPosition).replace(/~and~/g, "&");\
        var pathWithQuery = ampersandPosition === -1 ? decoded : decoded.substring(0, ampersandPosition);\
        window.history.replaceState(\
          null,\
          null,\
          l.pathname.slice(0, -1) + (pathWithQuery || "") + (queryParams || "") + l.hash\
        );\
      }\
    })();\
  </script>' out/index.html
fi

# Deploy to Firebase hosting
echo "Deploying to Firebase hosting..."
firebase deploy --only hosting

echo "Deployment completed successfully!"
echo "Your website is now live at: https://swiftcart-bsbrc.web.app"
