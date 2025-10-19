# Astro Ticketing (Minimal)

This is a minimal Next.js + Supabase + Razorpay ticketing demo.

Env vars required (set in Vercel or locally):

- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_KEY (for server)
- RESEND_API_KEY (or configure SMTP in verify-payment)
- EMAIL_FROM
- BASE_URL (e.g., https://your-site.vercel.app)

Supabase SQL to create tickets table:

CREATE TABLE tickets (
  id text primary key,
  name text,
  email text,
  payment_id text,
  qr text,
  used boolean default false,
  created_at timestamptz default now(),
  used_at timestamptz
);

Run locally:

1. npm install
2. In PowerShell set env vars (example):

  $env:RAZORPAY_KEY_ID = 'rzp_test_...'; $env:RAZORPAY_KEY_SECRET = 'your_secret';
  $env:SUPABASE_URL = 'https://xyz.supabase.co'; $env:SUPABASE_ANON_KEY = 'anon...';
  $env:SUPABASE_SERVICE_KEY = 'service_role_key'; $env:RESEND_API_KEY = 're_...';
  $env:EMAIL_FROM = 'noreply@yourdomain.com'; $env:BASE_URL = 'http://localhost:3000'

3. npm run dev

Developer tip: install these dev dependencies to satisfy TypeScript/editor type checks locally:

npm install -D @types/node @types/react @types/react-dom

SMTP (Gmail) setup (optional):

1. Enable 2FA on your Google account.
2. Create an App Password (select Mail) and copy the generated password.
3. Put your Gmail address and app password in env vars:

  $env:SMTP_USER = 'you@gmail.com'; $env:SMTP_PASS = 'app_password'

4. The code uses Nodemailer with Gmail SMTP by default if `SMTP_USER` and `SMTP_PASS` are present.

Admin dashboard:

- A simple admin UI will be added that is protected by an admin secret (ADMIN_SECRET) stored in server env. The admin can search tickets and mark them used/unuse.
UI polish:

- Pages now use a shared `Layout` and `Header` component and have improved Tailwind styling for forms, cards, and buttons.

Email template & attachments:

- Confirmation emails now include an inline QR image and attach a PDF version of the ticket (generated server-side). Ensure `SMTP_USER` and `SMTP_PASS` env vars are set for Gmail app password.
- Attachments increase email size; ensure your SMTP provider supports attachments and consider limiting image resolution if you hit size limits.

Storage & signed links:

- Generated ticket PDFs are uploaded to a Supabase Storage bucket named `tickets` (server will attempt to create it if allowed).
- The app generates a time-limited signed URL for each PDF and includes it in the confirmation email and ticket API response.
- Configure expiry with `STORAGE_URL_EXPIRES` (seconds), default is 604800 (7 days).




To use the admin dashboard:

1. Set `ADMIN_SECRET` in your environment (use a long random string).
2. Visit `/admin`, enter the secret, then search/manage tickets.



Notes:
- This is a demo scaffold. Verify Razorpay signatures on server in production.
- Replace Resend with SMTP if needed.
