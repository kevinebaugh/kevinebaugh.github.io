# Redesign counter

Cloudflare Worker behind the "Randomize design" counter on kevinebaugh.com. It stores one global count in a Durable Object and is routed at `kevinebaugh.com/api/redesigns`:

- `GET /api/redesigns` returns `{"count": N}`
- `POST /api/redesigns` adds one and returns the new count (only from `Origin: https://kevinebaugh.com`)

The leading underscore keeps GitHub Pages (Jekyll) from publishing this folder.

## Deploy

```bash
cd _counter
npx wrangler@4 login
npx wrangler@4 deploy
```

## Run locally

```bash
cd _counter
npx wrangler@4 dev
```
