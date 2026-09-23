# Deployment

## Local

```bash
npm run pipeline
npm run dev
# production
npm run build && npm start
```

## GitHub Pages

1. Connect GitHub repo
2. Build command: `npm run pipeline && npm run check && npm run build`\n   CI pins `ALGOFORGE_UPSTREAM_REF` to an exact upstream commit for reproducible data generation.
3. Output: `out/` directory
4. Env: `NEXT_PUBLIC_SITE_URL=https://stack-shade.github.io/algoforge`

## Headers

Configure headers via `next.config.ts` or middleware for CSP, HSTS, and cache on static assets.
