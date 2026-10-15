# Lab: Put Your MERN App on the Internet

You'll deploy **your own CU2 project** to your own Ubuntu server, a DigitalOcean
"Droplet", and prove that anyone can use it at `http://<DROPLET_IP>/`.

```text
Your browser ──HTTP :80──▶ Nginx ──┬── /          your built React files (/var/www/student-app)
                                   └── /api/...  ──▶ your Express app on 127.0.0.1:3000 (run by PM2)
                                                        └──▶ MongoDB on 127.0.0.1:27017 (password protected)
```

- **Nginx** is the only public entry point. It serves your React build and forwards `/api/...` to Express.
- **Express and MongoDB are private.** Ports 3000 and 27017 are closed to the internet by the firewall.
- Your server already has Node.js 24, PM2, MongoDB 9, Nginx and a firewall installed.

> This lab uses plain HTTP, which is not encrypted. Use fake data and throwaway passwords only.

---

## Fill in your values first

| Placeholder | Meaning | Yours |
| --- | --- | --- |
| `<DROPLET_IP>` | your server's IP (from your instructor) | |
| `<REPO_URL>` | your GitHub repo URL | |
| `<BACKEND_DIR>` | folder with the Express `package.json`, e.g. `backend` | |
| `<ENTRY_FILE>` | file that calls `app.listen`, e.g. `index.js` or `server.js` | |
| `<FRONTEND_DIR>` | folder with the Vite `package.json`, e.g. `frontend` | |
| `<VITE_VAR>` | the `import.meta.env.VITE_…` name your frontend uses | |
| Routes start with `/api`? | `app.use("/api/users", …)` = yes, `app.use("/users", …)` = no | |

## Before class (on your laptop)

1. Save the **lab key file** your instructor gives you, e.g. as `~/.ssh/b18-lab-key`, and make it private (macOS/Linux):
   ```bash
   chmod 600 ~/.ssh/b18-lab-key
   ```
   It's a private key. Don't post it anywhere, and use it only for your own server.
2. Make sure your repo:
   - has a `package-lock.json` in both the backend and frontend folders;
   - reads all API URLs from **one** `VITE_…` variable, with no `http://localhost:…` written in the code;
   - reads the MongoDB URI, JWT secret and port from `process.env`;
   - does **not** contain a `.env` file in Git.

## In class

**1. Connect** *(laptop)*
```bash
ssh -i ~/.ssh/b18-lab-key deploy@<DROPLET_IP>
```
The first time, SSH asks you to trust the server's fingerprint. Your instructor will tell you how to check it.

**2. Clone and inspect your project** *(server, as deploy)*
```bash
mkdir -p ~/apps && cd ~/apps
git clone <REPO_URL> myapp
cd ~/apps/myapp
grep -rhoE "process\.env\.[A-Za-z_]+" <BACKEND_DIR> --include=*.js --exclude-dir=node_modules | sort -u
grep -rhoE "app\.use\([\"'][^\"']+" <BACKEND_DIR> --include=*.js --exclude-dir=node_modules | sort -u
grep -lE "\.listen\(" <BACKEND_DIR>/*.js
grep -rhoE "import\.meta\.env\.VITE_[A-Z_]+" <FRONTEND_DIR>/src | sort -u
grep -rn "localhost:" <FRONTEND_DIR>/src || echo "(none)"
```
Write down your variable names, how the routes start, and your entry file. If the last command prints anything, fix those lines in your code before going on.

**3. Backend: install and create `.env` securely** *(server, as deploy)*
```bash
cd ~/apps/myapp/<BACKEND_DIR>
npm ci --omit=dev
umask 077
grep '^MONGODB_URI=' ~/mongodb-app.env > .env
echo 'PORT=3000' >> .env
echo "JWT_SECRET_KEY=$(openssl rand -hex 32)" >> .env
echo 'JWT_EXPIRES_IN=1h' >> .env
chmod 600 .env
cut -d= -f1 .env
git status --short --ignored .env
```
- `~/mongodb-app.env` was created for your server only. Never commit it or share it.
- **Rename to match your code.** If your code uses `MONGO_URI`, run `sed -i 's/^MONGODB_URI=/MONGO_URI=/' .env`. If it uses `JWT_SECRET` instead of `JWT_SECRET_KEY`, change that line. Add any other names from step 2 the same way.
- **Check Git ignores it.** The last command must print `!! .env`. If it doesn't, add `.env` to `.gitignore` first.
- **Don't display the values.** Use `cut -d= -f1 .env` to see names only, never `cat .env`.

**4. Start the backend with PM2** *(server, still in `<BACKEND_DIR>`)*
```bash
pm2 start <ENTRY_FILE> --name myapp-api
pm2 logs myapp-api --lines 20 --nostream
curl -i http://127.0.0.1:3000/<one of your GET routes>
pm2 save
```
In the logs you want `injected env (N)` with N greater than 0, and `MongoDB Connected`. If you have a seed script, run it from this folder, e.g. `node utils/seed.js`.

**5. Build and publish the frontend** *(server, as deploy)*
```bash
cd ~/apps/myapp/<FRONTEND_DIR>
npm ci
echo '<VITE_VAR>=/api' > .env.production
npm run build
grep -o 'localhost:[0-9]*' dist/assets/*.js | sort -u
rsync -a --delete --chmod=D755,F644 dist/ /var/www/student-app/
```
- **Check for `localhost`.** The `grep` must print **nothing**. Anything it prints would make your site call *the visitor's own computer*.
- **`VITE_` values are public.** They end up in the JavaScript anyone can download, so only `/api` goes here, never a secret.

**6. Point Nginx at your app** *(laptop → new SSH session as root)*
```bash
ssh -i ~/.ssh/b18-lab-key root@<DROPLET_IP>
nano /etc/nginx/sites-available/student-app
```
Leave **exactly one** `proxy_pass` line uncommented:
- routes start with `/api` → `proxy_pass http://127.0.0.1:3000;` (no slash at the end)
- routes don't start with `/api` → `proxy_pass http://127.0.0.1:3000/;` (slash at the end removes `/api`)

```bash
ln -s /etc/nginx/sites-available/student-app /etc/nginx/sites-enabled/student-app
rm /etc/nginx/sites-enabled/mern-lab-ready
nginx -t && systemctl reload nginx
```
Use root **only** for this step. Run `pm2` as `deploy`, never as root.

## Prove it's live (from your laptop)

- [ ] `http://<DROPLET_IP>/` shows your app.
- [ ] I created a record in the app, refreshed the page, and it's still there. That proves MongoDB write + read.
- [ ] Opening a page directly, e.g. `http://<DROPLET_IP>/login`, and refreshing it still works.
- [ ] `curl -i http://<DROPLET_IP>/api/<route>` returns `HTTP/1.1 200` and JSON.
- [ ] `pm2 status` (as deploy) shows `myapp-api` **online**.
- [ ] `git status --short --ignored .env` shows `!! .env`.
- [ ] Ports 3000 and 27017 are closed (macOS):
  ```bash
  nc -z -G 5 <DROPLET_IP> 3000 && echo OPEN || echo closed
  nc -z -G 5 <DROPLET_IP> 27017 && echo OPEN || echo closed
  ```

## If something breaks

| You see | Check | Usual fix |
| --- | --- | --- |
| `502 Bad Gateway` | `pm2 status`, `pm2 logs myapp-api` | backend crashed or the port is wrong. Fix it, then `pm2 restart myapp-api` |
| `Cannot GET /api/...` | how your routes start (step 2) | change the `proxy_pass` slash choice, then `nginx -t && systemctl reload nginx` |
| `Authentication failed.` | `cut -d= -f1 .env` | rebuild `.env` from `~/mongodb-app.env` (step 3) |
| `injected env (0)` | which folder you were in | `pm2 delete myapp-api`, `cd <BACKEND_DIR>`, start again, `pm2 save` |
| App calls `localhost` | step 5 `grep` | fix the code or `.env.production`, rebuild, rsync again |
| Refresh gives 404 | the Nginx `location /` block | use the template's `try_files … /index.html` line |

**Never fix things by opening port 3000 or 27017, or by turning off the firewall.**

## Reflection (answer in 1–3 sentences each)

1. What does **Nginx** do in your deployment, and why doesn't the browser talk to Express directly?
2. What is inside `dist/` after **`npm run build`**, and why don't we run `npm run dev` on the server?
3. Which of your **environment variables** are public and which are secret? How did you keep the secret ones off GitHub and out of the browser?
4. What does **PM2** do that `node index.js` doesn't? What would happen after a reboot without `pm2 save`?
5. Why does **MongoDB** listen only on `127.0.0.1` with a password, and why does your app's database user have access to just one database?
6. Your site uses HTTP, not HTTPS. What could someone on the same Wi-Fi see?
