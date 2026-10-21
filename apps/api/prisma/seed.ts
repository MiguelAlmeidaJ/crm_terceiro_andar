import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { PrismaClient, Role } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';

loadEnv({ path: resolve(__dirname, '../../../.env') });
const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL obrigatória');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) {
    throw new Error('Defina ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 12 caracteres)');
  }
  const passwordHash = await hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: process.env.ADMIN_NAME || 'Administrador',
      passwordHash,
      role: Role.OWNER,
    },
  });
  console.log('Conta administradora inicial pronta:', email);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
