// PM2 executa os processos Node diretamente, sem Docker.
// Requer Node.js 22+, pnpm e pm2 instalados.
const path = require('node:path');
const root = __dirname;
process.loadEnvFile(path.join(root, '.env'));

module.exports = {
  apps: [
    {
      name: 'terceiro-andar-api',
      cwd: path.join(root, 'apps/api'),
      script: path.join(root, 'apps/api/dist/main.js'),
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: '3446',
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        WEB_ORIGIN: process.env.WEB_ORIGIN || 'http://localhost:3445'
      }
    },
    {
      name: 'terceiro-andar-web',
      cwd: path.join(root, 'apps/web'),
      script: path.join(root, 'apps/web/node_modules/next/dist/bin/next'),
      interpreter: 'node',
      args: 'start -p 3445 -H 127.0.0.1',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      max_memory_restart: '700M',
      env: {
        NODE_ENV: 'production',
        PORT: '3445',
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3446'
      }
    }
  ]
};
