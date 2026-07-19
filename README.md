# Compact Resume Builder

A local-first resume builder built with React, TypeScript, Vite, Zustand, Zod, and dnd-kit.

## Features

- Compact two-column resume preview
- Editable resume content, layout, and theme settings
- Local autosave in the browser
- JSON import and export
- Print-to-PDF flow for saving the resume

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
npm run check
```

This runs:

```bash
npm run lint
npm run test:ci
npm run build
```

Use `npm run test` for watch mode while developing.

## Git Workflow

Start each phase from the latest `main`:

```bash
git switch main
git pull origin main
git switch -c phase-X-name
```

After finishing a phase:

```bash
git add .
git commit -m "Describe the phase"
git push -u origin phase-X-name

git switch main
git pull origin main
git merge phase-X-name
git push origin main
```
