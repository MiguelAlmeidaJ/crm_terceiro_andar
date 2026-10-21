// Execute na raiz da branch develop: node atualizar-prisma7.cjs
const fs=require('node:fs'); const path=require('node:path');
const root=process.cwd();
function file(p){return path.join(root,p)}
function read(p){if(!fs.existsSync(file(p)))throw Error('Arquivo não encontrado: '+p);return fs.readFileSync(file(p),'utf8')}
function write(p,s){fs.writeFileSync(file(p),s,'utf8');console.log('Atualizado:',p)}
if(!fs.existsSync(file('apps/api/prisma/schema.prisma')) || !fs.existsSync(file('pnpm-workspace.yaml')))throw Error('Execute na raiz do monorepo crm-terceiro-andar');
const schemaPath='apps/api/prisma/schema.prisma';let schema=read(schemaPath);
schema=schema.replace(/generator client\s*\{[^}]*\}/m,`generator client {\n  provider     = "prisma-client"\n  output       = "../src/generated/prisma"\n  moduleFormat = "cjs"\n}`);
schema=schema.replace(/datasource db\s*\{[^}]*\}/m,`datasource db {\n  provider = "postgresql"\n}`);
write(schemaPath,schema);
const config=`import { resolve } from 'node:path';\nimport { config as loadEnv } from 'dotenv';\nimport { defineConfig } from 'prisma/config';\n\nloadEnv({ path: resolve(process.cwd(), '../../.env') });\n\nexport default defineConfig({\n  schema: 'prisma/schema.prisma',\n  migrations: { path: 'prisma/migrations' },\n  datasource: { url: process.env.DATABASE_URL ?? '' },\n});\n`;
write('apps/api/prisma.config.ts',config);
let service=read('apps/api/src/prisma/service.ts').replace("from '@prisma/client'","from '../generated/prisma/client'");
service=service.replace("import { PrismaClient } from '../generated/prisma/client';", "import { PrismaClient } from '../generated/prisma/client';\nimport { PrismaPg } from '@prisma/adapter-pg';");
service=service.replace(/export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy \{/,`export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy {\n constructor(){\n   if(!process.env.DATABASE_URL) throw new Error('DATABASE_URL obrigatória');\n   super({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });\n }`);
write('apps/api/src/prisma/service.ts',service);
const substitutions={
 'apps/api/src/clients/clients.ts':"from '../generated/prisma/client'",
 'apps/api/src/tasks/tasks.ts':"from '../generated/prisma/client'"
};
for(const [p,to] of Object.entries(substitutions)){let s=read(p).replace("from '@prisma/client'",to);write(p,s)}
let seed=read('apps/api/prisma/seed.ts');
seed=seed.replace("from '@prisma/client'","from '../src/generated/prisma/client'");
seed=seed.replace("import { hash } from 'bcryptjs';", "import { hash } from 'bcryptjs';\nimport { PrismaPg } from '@prisma/adapter-pg';\nimport { config as loadEnv } from 'dotenv';\nimport { resolve } from 'node:path';\nloadEnv({ path: resolve(process.cwd(), '../../.env') });");
seed=seed.replace('const prisma = new PrismaClient();',"if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL obrigatória');\nconst prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });");
write('apps/api/prisma/seed.ts',seed);
let ts=JSON.parse(read('apps/api/tsconfig.json'));delete ts.compilerOptions.baseUrl;write('apps/api/tsconfig.json',JSON.stringify(ts,null,2)+'\n');
// TypeScript 6: remove deprecated baseUrl from any other project configs while preserving mappings.
for(const p of ['apps/web/tsconfig.json']){let t=JSON.parse(read(p));if('baseUrl' in t.compilerOptions){delete t.compilerOptions.baseUrl;write(p,JSON.stringify(t,null,2)+'\n')}}
let pkg=JSON.parse(read('apps/api/package.json'));
pkg.scripts['prisma:generate']='prisma generate';
pkg.scripts['prisma:push']='prisma db push';
pkg.scripts['prisma:seed']='tsx prisma/seed.ts';
write('apps/api/package.json',JSON.stringify(pkg,null,2)+'\n');
let ignore=read('.gitignore');if(!ignore.includes('apps/api/src/generated/prisma'))write('.gitignore',ignore.trimEnd()+'\napps/api/src/generated/prisma/\n');
console.log('\nArquivos migrados. Execute os comandos de instalação e validação indicados na conversa.');
