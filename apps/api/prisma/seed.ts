import { resolve } from 'node:path';

process.loadEnvFile(resolve(__dirname, '../../../.env'));

import { PrismaClient, Role } from '../src/generated/prisma/client';
import { hash } from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'node:path';
loadEnv({ path: resolve(process.cwd(), '../../.env') });
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL obrigatória');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
async function main() {
 const email=process.env.ADMIN_EMAIL, password=process.env.ADMIN_PASSWORD;
 if(!email || !password || password.length<12) throw new Error('Defina ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 12 caracteres)');
 await prisma.user.upsert({where:{email:email.toLowerCase()},update:{},create:{email:email.toLowerCase(),name:process.env.ADMIN_NAME||'Administrador',passwordHash:await hash(password,12),role:Role.OWNER}});
 console.log('Conta administradora inicial pronta:',email);
}
main().finally(()=>prisma.$disconnect());
