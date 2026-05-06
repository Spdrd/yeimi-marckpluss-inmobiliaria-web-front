# AGENTS.md — Yeimi Inmobiliaria / Marckpluss (Angular 16)

## Commands

| Action | Command |
|--------|---------|
| Dev server (Angular) | `npm start` → `http://localhost:4200/` |
| Backend (chatbot) | `npm run backend` (prod) / `npm run backend:dev` (nodemon) |
| Build | `npm run build` → `dist/my-landing` |
| Tests | `npm test` (Karma/Jasmine, opens browser) |
| Docker build | `docker build .` (uses Bun for Angular build + Nginx) |

- No lint/format tools configured. Do not add without asking.
- Uses `package-lock.json` and `bun.lock` — either npm or bun works for install.

## Architecture

Single-page Angular 16 app (`"type": "module"` in package.json) with an embedded Express/OpenAI chatbot backend.

```
src/app/
  core/            → DomusService, WhatsappService, models
  chatbot/         → ChatbotComponent + ChatService + models
  myprofile/       → Hero/portada con CTA y filtros
  habilidades/     → Grid paginado de propiedades (Domus API)
  cursos/          → Carrusel automático de propiedades
  individual-card/ → Detalle de propiedad
  states/          → Estadísticas animadas
  tech/            → Valores de empresa
  aboutme/         → Sobre nosotros
  contact/         → Formulario (FormSubmit.co)
  header/          → Sidebar lateral
  header-top/      → Navegación superior con scroll detection
  footer/          → Pie de página
  projects/        → Portafolio (comentado en template)
  experiences/     → Experiencia laboral (comentado en template)
```

- Root module: `src/app/app.module.ts`
- Routing: `src/app/app-routing.module.ts` (route `""` → `MyprofileComponent`, `propiedad/:id` → `IndividualCardComponent`)
- External APIs: `src/environments/environment.ts` (chatbotApiUrl, domusApiUrl, whatsappNumber)

## Backend (app.js)

Express server on `PORT` (default 3000) exposing `POST /api/chat`. Uses OpenAI Assistants API with thread persistence per userId in memory. Requires `.env` with `OPENAI_API_KEY` and `ASSISTANT_ID`. Note: `cors` is imported in app.js but not listed in `package.json` — may need `npm install cors` if missing.

## Key conventions

- Component-per-folder: `.component.ts`, `.html`, `.css`, `.spec.ts`
- Global styles in `src/styles.css`; component CSS uses `styleUrls` (ViewEncapsulation default)
- Responsive breakpoints: 1024px, 890px, 640px, 480px
- CSS uses CSS custom properties for theming (`--color-main`, `--color-second`, `--color-title`, `--color-main2`, `--color-text2`)
- Fonts via Google Fonts CDN (Playfair Display, Montserrat/Inter)
- Icons via Font Awesome CDN
- Hero height controlled via `heroHeightVh` variable in TypeScript, passed as `--hero-height` CSS custom property

## Deployment

- Frontend: Vercel or Docker (Bun build → Nginx)
- Backend: separate deploy (PockSite proxy at `marckplussopenai.pocksite.com`)
- Nginx SPA routing: `try_files $uri $uri/ /index.html`

## Existing instruction files

- `.github/copilot-instructions.md` — detailed Copilot guidance (keep in sync)

## Gotchas

- `app.js` imports `cors` but it may not be in `package.json` dependencies
- `environment.ts` export is misspelled as `enviroment` (missing 'n')
- No SSR despite README mentioning it — this is a standard Angular browser build
- `projects/` and `experiences/` components exist but are commented out in `myprofile.component.html`
- Angular 16 uses `zone.js` ~0.13, not the newer signal-based reactivity
