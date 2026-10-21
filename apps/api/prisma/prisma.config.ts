import { resolve } from 'node:path';
import { defineConfig } from 'prisma/config';

// Carrega o .env localizado na raiz do monorepo.
process.loadEnvFile(resolve(__dirname, '../../.env'));

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});