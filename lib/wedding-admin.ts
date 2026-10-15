import { createHmac, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const CREDENTIALS_PATH = `${process.cwd()}/private/admin-credentials.txt`;
const COOKIE_NAME = 'wedding_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;

type AdminSession = { username: string; expiresAt: number };

function sessionSecret() {
  return process.env.WEDDING_ADMIN_SESSION_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

async function getCredentials() {
  let content: string;
  try {
    content = await readFile(CREDENTIALS_PATH, 'utf8');
  } catch {
    return [];
  }

  return content.split(/\r?\n/).flatMap(line => {
    const [username, scheme, saltHex, hashHex, ...extra] = line.trim().split('|');
    if (!username || scheme !== 'scrypt' || !/^[a-f0-9]{32}$/i.test(saltHex || '') || !/^[a-f0-9]{128}$/i.test(hashHex || '') || extra.length) return [];
    return [{ username, salt: Buffer.from(saltHex, 'hex'), hash: Buffer.from(hashHex, 'hex') }];
  });
}

export async function authenticateAdmin(username: string, password: string) {
  const credentials = await getCredentials();
  const candidate = credentials.find(item => item.username.toLowerCase() === username.trim().toLowerCase());
  const salt = candidate?.salt || Buffer.alloc(16);
  const expected = candidate?.hash || Buffer.alloc(64);
  const actual = await scrypt(password, salt, 64) as Buffer;
  return Boolean(candidate && actual.length === expected.length && timingSafeEqual(actual, expected));
}

function sign(payload: string) {
  const secret = sessionSecret();
  if (secret.length < 32) throw new Error('Missing or weak WEDDING_ADMIN_SESSION_SECRET');
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createAdminSession(username: string) {
  const payload = Buffer.from(JSON.stringify({ username, expiresAt: Date.now() + SESSION_TTL_SECONDS * 1000 } satisfies AdminSession)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(request: Request) {
  const secret = sessionSecret();
  if (secret.length < 32) return null;
  const cookieHeader = request.headers.get('cookie') || '';
  const cookie = cookieHeader.split(';').map(part => part.trim()).find(part => part.startsWith(`${COOKIE_NAME}=`));
  const token = cookie?.slice(COOKIE_NAME.length + 1) || '';
  const [payload, suppliedSignature, ...extra] = token.split('.');
  if (!payload || !suppliedSignature || extra.length) return null;
  const expectedSignature = sign(payload);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AdminSession;
    if (!session.username || !Number.isFinite(session.expiresAt) || session.expiresAt <= Date.now()) return null;
    return { username: session.username, maxAge: Math.floor((session.expiresAt - Date.now()) / 1000) };
  } catch {
    return null;
  }
}

export function adminSessionCookie(token: string, maxAge = SESSION_TTL_SECONDS) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

export function adminLogoutCookie() {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
