# Set up protected invitation links

## 1. Apply the Supabase migration

Run `supabase-invitation-codes-migration.sql` in Supabase SQL Editor after the existing guestbook and RSVP migrations. If you already ran an earlier version, run the updated file again; it adds the encrypted-code and link-format columns used by the admin link history. It creates the private invitation registry, revokes anonymous direct writes and RSVP reads, limits public table reads to visible wishes, and removes public execution of the RSVP write RPC. RSVP status is read through the server only after validating that guest's invite code.

Existing invitation URLs without `k` will remain viewable but cannot submit RSVPs or wishes. Generate and resend links from the invitation tool after configuration.

## 2. Create the admin account

You can double-click `quan-ly-thiep-cuoi.bat` and select **Tao / doi username va mat khau**, or run this from the repository root:

```powershell
npm run admin:set-credentials
```

Enter a username and any non-empty password. Password input is hidden. A short password is allowed for convenience, but is easier to guess, so keep the GitHub repository private and do not reuse an important password. The script writes only a salted scrypt hash to `private/admin-credentials.txt` in the format `username|scrypt|salt_hex|hash_hex`; it never writes the plaintext password. Commit this file to Git after creating the account so the deployed site can read the same credentials. To change the username or password, run the command again and commit the updated file.

Keep the GitHub repository private. Although the file contains only a salted hash, a public repository exposes it to offline password guessing. Choose a unique, strong password and never add a plaintext `username|password` file.

## 3. Configure server-only environment variables

For local setup, the `.bat` menu's **Cau hinh Supabase de chay local** option asks for the secret/service-role key without displaying it and creates `.env.local`. You can also follow the manual steps below.

Set these in Netlify Site configuration > Environment variables:

- `SUPABASE_URL`: the Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: the Supabase server secret key (`sb_secret_...`) or legacy `service_role` JWT (`eyJ...`). The app sends the new secret key only as `apikey`; it sends the legacy JWT as both `apikey` and Bearer. Never expose either key in HTML, client JavaScript, or a `NEXT_PUBLIC_` variable.

The guestbook SQL migrations grant the server `SELECT` access needed by the private RSVP and wish dashboards. If the dashboard reports a permission error, rerun the latest `supabase-invitation-codes-migration.sql` in Supabase SQL Editor; it is safe to rerun.

The issued-link list also shows whether each invitation has unlocked the album. **Thu hồi album** removes only that invitation's saved album-unlock record; the invitation link, RSVP, and wishes remain. The guest page checks the server again whenever the album is opened, so the revoked link will show the unlock prompt on its next attempt. Photos already viewed or downloaded cannot be recalled.

Guests who submit a wish without a valid official invitation code are saved with `is_visible = false`. They do not receive an invitation key and cannot unlock the album. Review these entries in **Lời chúc chờ duyệt** on the statistics page; approving one makes it visible on the invitation, while deleting it permanently removes the pending entry. Re-run the latest `supabase-invitation-codes-migration.sql` after deploying this feature so the server has delete permission for moderation.
- `WEDDING_ADMIN_SESSION_SECRET`: a random secret of at least 32 characters used to sign the secure admin session cookie.

For local development, put the same variables in the ignored `.env.local` file. Do not commit that file or send the values in chat.

Generate the session secret locally with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## 4. Issue guest links

Open `/thiepcuoi/tao-link.html` or `/thiepcuoi/thong-ke.html` and sign in with the same account. The dashboard API requires the same server-verified session; the browser no longer queries private RSVP/statistics data directly from Supabase. The session is stored in an HTTP-only, same-site cookie and expires after eight hours. In the link tool, enter the guest list and side, choose a URL format, then choose **Phát Hành Link Có Mã**. Only generated links include `k`; the database stores a SHA-256 hash for validation and a server-encrypted copy so the admin page can show links issued after this update. The server validates both the guest name (including supported Telex/slug forms) and code before accepting RSVP or wish submissions. Deleting a link removes its invitation credential but preserves existing RSVP and wish history.

The public page can still be viewed without a code. The code is an invitation credential, not proof of the guest's real-world identity; guests can forward their link.
