# HBD Message

An interactive 18th birthday experience for Maheen.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build          # local production build (base: /)
npm run build:pages    # GitHub Pages build (base: /HBD/)
npm run preview        # preview local build
npm run preview:pages  # build for Pages + preview at /HBD/
```

## GitHub Pages deployment

**Repository:** [muhamad-404/HBD](https://github.com/muhamad-404/HBD)  
**Live URL:** https://muhamad-404.github.io/HBD/

### One-time setup

1. Push this project to GitHub (see commands below).
2. On GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to the `main` branch — the deploy workflow runs automatically.

### What gets committed vs ignored

| Commit to GitHub | Ignored (in `.gitignore`) |
|---|---|
| Source code (`src/`, `index.html`, etc.) | `node_modules/` |
| `package.json` & `package-lock.json` | `dist/` (built by GitHub Actions) |
| `vite.config.js`, workflow files | `*.log` files |
| | `.env` files (secrets) |

### Optional: add background music

Place a royalty-free `background-music.mp3` in `src/assets/audio/`. The site works without it.

## Push to GitHub (first time)

```bash
git init
git add .
git commit -m "Initial commit: Maheen birthday website"
git branch -M main
git remote add origin https://github.com/muhamad-404/HBD.git
git push -u origin main
```

## Update the live site later

```bash
git add .
git commit -m "Describe your change"
git push
```

GitHub Actions rebuilds and redeploys automatically on every push to `main`.
