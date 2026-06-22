# Admin Setup

Steps to create the first superadmin account on a fresh local or production environment.

## Local Dev

### Prerequisites

- API running on `http://localhost:2010` (`pnpm dev` or `pnpm dev:api`)
- `ADMIN_BOOTSTRAP_SECRET` set in `apps/api/.env`

```env
ADMIN_BOOTSTRAP_SECRET=edoko-admin-2026
```

---

### Step 1 — Register an account

```bash
curl -X POST http://localhost:2010/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@edoko.com","password":"Admin1234!"}'
```

### Step 2 — Promote to superadmin

```bash
curl -X POST http://localhost:2010/api/admin/bootstrap \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@edoko.com","secret":"edoko-admin-2026"}'
```

Expected response:
```json
{ "message": "admin@edoko.com is now a superadmin" }
```

### Step 3 — Log in to the admin panel

Open `http://localhost:5191` and sign in with the credentials from Step 1.

---

## URLs (local)

| App         | URL                        |
|-------------|----------------------------|
| Web (customer) | http://localhost:5190   |
| Admin panel | http://localhost:5191      |
| API         | http://localhost:2010      |

---

## Production

Replace `http://localhost:2005` with your deployed API URL, and set `ADMIN_BOOTSTRAP_SECRET` in the Render dashboard environment variables.

> The bootstrap endpoint can be called multiple times to promote additional accounts. It does nothing if the account is already a superadmin.
