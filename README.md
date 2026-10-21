# CRM Terceiro Andar — Nova aplicação (MVP)

Primeira implementação independente a partir da documentação do repositório `thiagoihan/crm-terceiro-andar`.

## Stack
Next.js 15 (App Router) + React 19 + TypeScript; NestJS 10 + Prisma 6; PostgreSQL 16; Docker Compose.

## Escopo funcional já implementado
- Login com cookie HttpOnly e senha bcrypt; sessão JWT; perfis OWNER / ADMIN / MEMBER / VIEWER (VIEWER não grava).
- Painel com contagens do banco.
- Listagem e cadastro de clientes, atualização da etapa comercial.
- Quadro de funil, alterações de etapa.
- Listagem, criação e atualização de status das tarefas.
- Validação de dados na API, Prisma e esquema relacional inicial.

**Ainda não é a migração integral do CRM original:** faltam projetos, cadência, follow-ups, estratégia, radar, arquivos, convites, mensagens, auditoria, regras finas por papel, recuperação de senha, proteção CSRF explícita e testes E2E. O esquema Prisma presente é um núcleo novo e **não corresponde às 43 tabelas do SQL proposto no repositório original**. Não importar diretamente aquele `schema.sql` aqui.

## Windows 10/11 / Docker Desktop
Instale o Docker Desktop (com WSL 2 habilitado) e execute os comandos abaixo no **PowerShell**, na pasta extraída:

```powershell
Copy-Item .env.example .env
notepad .env
# Defina POSTGRES_PASSWORD, JWT_SECRET e ADMIN_PASSWORD antes de subir.
docker compose up -d --build
docker compose exec api npx tsx prisma/seed.ts
```

Acesse o frontend em http://localhost:3445 e a API em http://localhost:3446/api.
Os serviços estão publicados em `127.0.0.1` e só aceitam acesso do próprio computador.
Para recriar depois de alterar `NEXT_PUBLIC_API_URL`, execute `docker compose up -d --build`.

## Linux / Docker
Instale Docker Engine e Docker Compose Plugin. Na pasta desta aplicação:

```bash
cp .env.example .env
# Altere obrigatoriamente POSTGRES_PASSWORD, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD,
# WEB_ORIGIN e NEXT_PUBLIC_API_URL para o domínio final com HTTPS.
docker compose up -d --build
# CRIAR ADMIN (uma vez, depois de o banco e API subirem):
docker compose exec api npx tsx prisma/seed.ts
```

**Atenção ao seed em contêiner:** `tsx` é dependência de desenvolvimento instalada no contêiner de demonstração. Em produção, recomendamos substituir por um CLI compilado e migrations versionadas.

Use proxy reverso com TLS: `/` -> `127.0.0.1:3445` e `/api` -> `127.0.0.1:3446` no mesmo domínio. Configure `NEXT_PUBLIC_API_URL=https://crm.seudominio.com` e `WEB_ORIGIN=https://crm.seudominio.com`, reconstruindo a imagem do frontend. O `.env.example` vem com localhost apenas para desenvolvimento.

O serviço API usa `prisma db push` no boot **somente para acelerar o MVP**: antes de produção, crie migrations versionadas (`prisma migrate dev` em ambiente de desenvolvimento; `prisma migrate deploy` em produção). Implemente backup externo, observabilidade e homologação de autorização/CSRF antes de armazenar dados reais.

## Desenvolvimento local
```bash
npm install
cp .env.example .env
# PostgreSQL local em 5432 (ou docker compose up -d db)
npm run db:generate
npx prisma db push --schema apps/api/prisma/schema.prisma
npm run db:seed
npm run dev
```
Next: http://localhost:3445 | Nest API: http://localhost:3446/api.

## Próximas etapas
1. Transformar schema SQL original em modelo Prisma completo e migrations rastreáveis.
2. RBAC por operação e dono de registro; CSRF e endurecimento de segurança.
3. Módulos de projeto/etapas, relacionamento, estratégia e radar.
4. Testes unitários, integração, E2E; backup/restauração e migração real do Claude.

## Validação
Arquivos e compactação conferidos; não foi possível executar `npm install`, `prisma generate` ou os builds nesta sessão porque o ambiente de execução não tem acesso à internet para baixar dependências. Execute esses comandos e valide o funcionamento em homologação antes de qualquer uso real.
