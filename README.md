# Terceiro Andar CRM — Next.js + NestJS + Prisma

MVP com frontend Next.js na porta **3445** e API NestJS na porta **3446**, executados diretamente por **PM2** e com dependências gerenciadas por **pnpm**. O PostgreSQL pode ser local ou subir isoladamente via Docker.

## Pré-requisitos
- Node.js **22+** e pnpm 9 (via Corepack)
- PM2 (`npm install -g pm2`, ou `pnpm add -g pm2` quando pnpm global estiver configurado)
- PostgreSQL 16 (local ou o contêiner isolado abaixo)

## Windows (PowerShell ou Git Bash, na raiz do projeto)

```powershell
corepack enable
corepack prepare pnpm@9.15.9 --activate
npm install -g pm2
Copy-Item .env.example .env
# Edite as senhas e JWT_SECRET no .env antes do próximo passo.
notepad .env
# Se desejar banco PostgreSQL em Docker, rode SOMENTE o banco:
docker compose -f compose.db.yml up -d
pnpm install
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm build
pm2 start ecosystem.config.cjs
pm2 status
```

Se o PostgreSQL já estiver instalado e funcionando em `localhost:5432`, **não rode** o comando Docker. O `db:seed` é idempotente para o administrador, mas suas credenciais devem ser mantidas em segredo.

Frontend: http://localhost:3445 | API: http://localhost:3446/api

## Atualizações

```powershell
git pull
pnpm install --frozen-lockfile # somente depois de gerar e versionar pnpm-lock.yaml
pnpm db:generate
pnpm db:push # apenas para MVP/testes; em produção utilizar migrations versionadas
pnpm build
pm2 restart ecosystem.config.cjs --update-env
pm2 logs
```

**Primeira instalação:** execute `pnpm install` (sem `--frozen-lockfile`) para gerar `pnpm-lock.yaml` e faça commit do lockfile.

## Linux (sem Docker para web/API)

Mesmo processo, com `cp .env.example .env`, Node.js 22+, pnpm, PM2 e PostgreSQL. Para reiniciar com o sistema: `pm2 startup` e `pm2 save` depois de validar o serviço. Recomenda-se Nginx com HTTPS na frente, banco com backup e autenticação fortalecida.

## Arquivos
- `ecosystem.config.cjs`: gerencia os dois serviços Node pelo PM2.
- `pnpm-workspace.yaml`: define os workspaces.
- `compose.db.yml`: banco de dados opcional, sem frontend/backend em contêiner.
- `.env.example`: variáveis de ambiente, incluindo `DATABASE_URL` apontando para localhost.

**Segurança:** não envie `.env` para o GitHub. Em produção HTTPS, o cookie de autenticação é `Secure`; para testes em HTTP localhost, caso o navegador não mantenha login, use HTTPS local ou ajuste a política de cookie especificamente para ambiente de desenvolvimento. Ainda faltam migrations, testes e proteção CSRF para produção.

**Escopo:** base de login, clientes, funil e tarefas. Não é a migração completa do protótipo original.
