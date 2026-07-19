# Compact Resume Builder

A local-first resume builder built with React, TypeScript, Vite, Zustand, Zod, and dnd-kit.

## Local Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://127.0.0.1:5173/
```

## Checks

```bash
npm run build
npm run lint
npm run test:run
```

If Vitest has trouble starting workers on Windows, run it serially:

```bash
npx vitest run --maxWorkers=1 --no-file-parallelism
```
