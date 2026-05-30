import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.join(rootDir, 'static');

const staticRoutes = [
  ['/assets', path.join(staticDir, 'assets')],
  ['/files', path.join(staticDir, 'files')],
  ['/backend', path.join(staticDir, 'backend')],
];

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

const createStaticMiddleware = () => {
  return (request, response, next) => {
    const requestUrl = new URL(request.url, 'http://localhost');
    const matchedRoute = staticRoutes.find(([route]) => {
      return requestUrl.pathname === route || requestUrl.pathname.startsWith(`${route}/`);
    });

    if (!matchedRoute) {
      next();
      return;
    }

    const [route, directory] = matchedRoute;
    const relativePath = decodeURIComponent(requestUrl.pathname.slice(route.length));
    const filePath = path.normalize(path.join(directory, relativePath));

    if (!filePath.startsWith(directory)) {
      response.statusCode = 403;
      response.end('Forbidden');
      return;
    }

    fs.stat(filePath, (statError, stats) => {
      if (statError || !stats.isFile()) {
        next();
        return;
      }

      const contentType = mimeTypes[path.extname(filePath)];

      if (contentType) {
        response.setHeader('Content-Type', contentType);
      }

      fs.createReadStream(filePath).pipe(response);
    });
  };
};

const staticAssetsPlugin = () => ({
  name: 'car-estimator-static-assets',
  configureServer(server) {
    server.middlewares.use(createStaticMiddleware());
  },
  configurePreviewServer(server) {
    server.middlewares.use(createStaticMiddleware());
  },
});

export default defineConfig({
  plugins: [react(), staticAssetsPlugin()],
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
