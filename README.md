# Compact Resume Builder

A local-first resume builder built with React, TypeScript, Vite, Zustand, Zod, and dnd-kit.

## Features

- Compact two-column resume preview
- Editable resume content, layout, and theme settings
- Local autosave in the browser
- JSON import and export
- Print-to-PDF flow for saving the resume

## Roadmap

- Add a screenshot-matched compact template based on the provided reference image:
  - Dense A4 resume layout with a wide main column and narrow right sidebar
  - Large uppercase name, blue professional title, and compact contact metadata row
  - Thin section dividers with small uppercase headings
  - Experience entries with role, company, date range, location, and bullet highlights
  - Sidebar language proficiency dots and compact skill chips
  - Projects, certifications, education, and additional information styled to match the reference

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
