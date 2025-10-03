# Next.js CRUD Users (MongoDB + Tailwind)

A minimal **Next.js 14 (App Router)** CRUD application for managing users.
- Backend: **API Route Handlers** under `/app/api/users`
- DB: **MongoDB** via **Mongoose**
- UI: **Tailwind CSS** with a clean, responsive layout
- Features: Create, Read, Update, Delete users (name, email, role)

## Quickstart

```bash
# 1) Install deps
npm install

# 2) Create .env
cp .env.example .env

# 3) Run in dev
npm run dev
# open http://localhost:3000
```

### .env
Create `.env` with:

```
MONGODB_URI="YOUR_MONGODB_ATLAS_CONNECTION_STRING"
MONGODB_DB="nextjs_crud"
# optional when deploying (Vercel): set public base url so server fetch uses absolute URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

> Tip: Use **MongoDB Atlas** (free tier). On Vercel, set the same env vars in your project settings.

## Scripts
- `npm run dev` – start dev server
- `npm run build` – build production
- `npm run start` – run production build
- `npm run lint` – Next.js ESLint

## Project Structure

```
app/
  api/users/route.ts          # GET, POST
  api/users/[id]/route.ts     # PUT, DELETE
  layout.tsx
  page.tsx
  globals.css
components/
  UserForm.tsx
  UserTable.tsx
  EditUserModal.tsx
lib/
  mongodb.ts                  # Mongoose connection helper
models/
  User.ts                     # Mongoose model
```

## How CRUD works (frontend ⇄ backend)

- **Create:** `UserForm` → `POST /api/users` → MongoDB
- **Read:** `page.tsx` fetches `GET /api/users` on the server (no-store)
- **Update:** `EditUserModal` → `PUT /api/users/:id` → refresh list
- **Delete:** `UserTable` action → `DELETE /api/users/:id` → refresh list

Server responses are JSON. Frontend calls use `fetch` with optimistic UI updates and `router.refresh()` to re-render server components.

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import it on **Vercel**.
3. Add env vars in **Settings → Environment Variables**:
   - `MONGODB_URI`
   - `MONGODB_DB` (optional)
   - `NEXT_PUBLIC_BASE_URL` = your Vercel URL, e.g. `https://your-app.vercel.app`
4. Deploy.

> Note: MongoDB Atlas works great on Vercel. No extra adapters required.

## Video Demo (Optional)

Record a short Loom:
- Create a user (validations)
- Edit the user’s role
- Delete a user
- Show code: API routes and model

## License
MIT
