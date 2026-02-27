# AFYALINK

Full-stack healthcare platform (React + Vite + Tailwind, Django + DRF + JWT).

## Local Development
- Frontend: `cd afyalink-frontend && npm install && npm run dev`
- Backend: `cd afyalink_backend && pip install -r requirements.txt && python manage.py migrate && python manage.py runserver`

## Deployment

### GitHub
1. Initialize repository:
   - `git init`
   - `git add . && git commit -m "Init AFYALINK"`
2. Create a GitHub repo and add remote:
   - `git remote add origin https://github.com/<your-username>/afyalink.git`
   - `git branch -M main && git push -u origin main`

### Vercel (Frontend)
1. From `afyalink-frontend`, run `npm run build` locally to verify.
2. Create a Vercel project and link this folder.
3. Set environment variable:
   - `VITE_API_URL=https://<render-backend-url>/api/`
4. Build command: `npm run build` ; Output dir: `dist`

### Render (Backend)
1. Use `render.yaml` at repo root to create services (New > Blueprints).
2. Render will provision:
   - Web Service (Python) with build/start commands
   - Postgres database (free plan) and inject `DATABASE_URL`
3. Environment vars automatically set from blueprint:
   - `DATABASE_URL`, `DJANGO_SECRET_KEY`, `DEBUG=false`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`
4. After deploy:
   - Visit `/api/auth/register` and `/api/auth/login` to verify
   - Update `CORS_ALLOWED_ORIGINS` and `ALLOWED_HOSTS` as needed

## Notes
- For Vercel + React Router, `vercel.json` routes all paths to `index.html`.
- Backend supports `DATABASE_URL` for Render via `dj-database-url`.
