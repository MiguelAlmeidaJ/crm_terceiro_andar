import { PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';
const prisma = new PrismaClient();
async function main() {
 const email=process.env.ADMIN_EMAIL, password=process.env.ADMIN_PASSWORD;
 if(!email || !password || password.length<12) throw new Error('Defina ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 12 caracteres)');
 await prisma.user.upsert({where:{email:email.toLowerCase()},update:{},create:{email:email.toLowerCase(),name:process.env.ADMIN_NAME||'Administrador',passwordHash:await hash(password,12),role:Role.OWNER}});
 console.log('Conta administradora inicial pronta:',email);
}
main().finally(()=>prisma.$disconnect());
