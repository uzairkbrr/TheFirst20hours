# Deploying to Vercel

## ⚠️ Important Warning
Vercel is a **Serverless** platform. This means the file system is **ephemeral** (read-only/temporary).
**Your SQLite database (`sql_app.db`) will be reset every time the app restarts or redeploys.**

For a persistent app, you MUST switch to a cloud database (e.g., Supabase, Neon, Railway) and update the `DATABASE_URL` environment variable.

## Setup Steps

1.  **Install Vercel CLI**:
    ```bash
    npm i -g vercel
    ```

2.  **Login**:
    ```bash
    vercel login
    ```

3.  **Deploy**:
    Run the following command in the root folder (`20hours`):
    ```bash
    vercel
    ```
    *   Set the existing code to the root? **Yes**.
    *   Link to existing project? **No**.
    *   Project Name? `first-20-hours`.
    *   Directory? `./`.

4.  **Environment Variables**:
    In Vercel Dashboard -> Settings -> Environment Variables:
    *   `VITE_API_URL`: `/api` (This makes the frontend talk to the relative backend API).
    *   `SECRET_KEY`: (Your secret key).

## Folder Structure Note
The included `vercel.json` configures Vercel to:
*   Build the Python backend from `backend/app/main.py`.
*   Build the React frontend from `frontend/package.json`.
*   Route `/api/*` requests to the Python backend.
*   Route everything else to the React frontend.
