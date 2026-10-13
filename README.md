# The 7 Candles: The Throne of God API

Microsserviço core em NestJS, TypeScript, TypeORM e PostgreSQL.

## Desenvolvimento

1. Copie `.env.example` para `.env` e ajuste as credenciais.
2. Instale as dependências com `npm install`.
3. Execute as migrations com `npm run migration:run`.
4. Inicie em desenvolvimento com `npm run start:dev`.

O schema é controlado por migrations; `synchronize` permanece desativado.

## Estrutura

```text
src/
	auth/       autenticação JWT e casos de uso
	chapters/   catálogo dos capítulos
	common/     validação Zod e erros compartilhados
	database/   conexão e migrations
	inventory/  persistência do inventário
	progress/   progresso e desbloqueio após boss
	users/      domínio e persistência de usuários
```

## Rotas

- `POST /auth/register`
- `POST /auth/login`
- `GET /chapters` (JWT)
- `GET /progress` (JWT)
- `POST /progress/chapters/:chapterId/complete` (JWT, após derrotar o boss)