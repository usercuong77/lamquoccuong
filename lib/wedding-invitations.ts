import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from 'node:crypto';

const DEFAULT_SUPABASE_URL = 'https://wabvabtlsfnrwuygdyls.supabase.co';

export type WeddingSide = 'Nhà Trai' | 'Nhà Gái';

export type WeddingInvitation = {
  id: string;
  invite_key: string;
  code_hash: string;
  display_name: string;
  side: WeddingSide;
  is_active: boolean;
};

export function getSupabaseServerConfig() {
  const url = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return { url: url.replace(/\/+$/, ''), serviceKey };
}

export async function supabaseServiceRequest(path: string, init: RequestInit = {}) {
  const { url, serviceKey } = getSupabaseServerConfig();
  const headers = new Headers(init.headers);
  headers.set('apikey', serviceKey);
  // New sb_secret keys are API keys, not JWTs. Legacy service_role keys are JWTs.
  if (serviceKey.startsWith('sb_secret_')) headers.delete('Authorization');
  else headers.set('Authorization', `Bearer ${serviceKey}`);
  headers.set('Accept', 'application/json');
  return fetch(`${url}/rest/v1/${path}`, { ...init, headers, cache: 'no-store' });
}

export function hashInvitationCode(code: string) {
  return createHash('sha256').update(code).digest('hex');
}

function invitationEncryptionKey() {
  const { serviceKey } = getSupabaseServerConfig();
  return createHash('sha256').update(`wedding-invitation-code:${serviceKey}`).digest();
}

export function encryptInvitationCode(code: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', invitationEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(code, 'utf8'), cipher.final()]);
  return `${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${encrypted.toString('base64url')}`;
}

export function decryptInvitationCode(value: string) {
  const [ivValue, tagValue, encryptedValue, ...extra] = value.split('.');
  if (!ivValue || !tagValue || !encryptedValue || extra.length) throw new Error('Invalid encrypted invitation code');
  const decipher = createDecipheriv('aes-256-gcm', invitationEncryptionKey(), Buffer.from(ivValue, 'base64url'));
  decipher.setAuthTag(Buffer.from(tagValue, 'base64url'));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, 'base64url')),
    decipher.final()
  ]).toString('utf8');
}

export function createInvitationCode() {
  return randomBytes(9).toString('base64url');
}

export function createInviteKey() {
  return randomUUID();
}

export function normalizeInvitationName(value: string) {
  return value.trim().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, character => character.toLowerCase() === 'đ' ? 'd' : 'D')
    .replace(/&/g, ' va ')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLocaleLowerCase('en');
}

function toTelexWord(word: string) {
  const value = word
    .replace(/ườ/g, 'uow#f').replace(/ướ/g, 'uow#s').replace(/ưở/g, 'uow#r').replace(/ưỡ/g, 'uow#x').replace(/ượ/g, 'uow#j')
    .replace(/ươ/g, 'uow');
  const mapping: Record<string, string> = {
    à:'a#f', á:'a#s', ả:'a#r', ã:'a#x', ạ:'a#j', ằ:'aw#f', ắ:'aw#s', ẳ:'aw#r', ẵ:'aw#x', ặ:'aw#j', ă:'aw',
    ầ:'aa#f', ấ:'aa#s', ẩ:'aa#r', ẫ:'aa#x', ậ:'aa#j', â:'aa', è:'e#f', é:'e#s', ẻ:'e#r', ẽ:'e#x', ẹ:'e#j',
    ề:'ee#f', ế:'ee#s', ể:'ee#r', ễ:'ee#x', ệ:'ee#j', ê:'ee', ì:'i#f', í:'i#s', ỉ:'i#r', ĩ:'i#x', ị:'i#j',
    ò:'o#f', ó:'o#s', ỏ:'o#r', õ:'o#x', ọ:'o#j', ồ:'oo#f', ố:'oo#s', ổ:'oo#r', ỗ:'oo#x', ộ:'oo#j', ô:'oo',
    ờ:'ow#f', ớ:'ow#s', ở:'ow#r', ỡ:'ow#x', ợ:'ow#j', ơ:'ow', ù:'u#f', ú:'u#s', ủ:'u#r', ũ:'u#x', ụ:'u#j',
    ừ:'uw#f', ứ:'uw#s', ử:'uw#r', ữ:'uw#x', ự:'uw#j', ư:'uw', ỳ:'y#f', ý:'y#s', ỷ:'y#r', ỹ:'y#x', ỵ:'y#j', đ:'dd'
  };
  let tone = '';
  let result = '';
  for (let index = 0; index < value.length; index++) {
    const character = value[index];
    if (character === '#' && value[index + 1]) {
      if (!tone) tone = value[++index];
      else index++;
      continue;
    }
    const lower = character.toLowerCase();
    const mapped = mapping[lower];
    if (!mapped) {
      result += character;
      continue;
    }
    const [base, mark] = mapped.split('#');
    result += character === character.toUpperCase() && character !== character.toLowerCase()
      ? base.charAt(0).toUpperCase() + base.slice(1)
      : base;
    if (!tone && mark) tone = mark;
  }
  return result + tone;
}

export function toTelexInvitationName(value: string) {
  return value.replace(/&/g, 'va')
    .replace(/[^a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếểễệìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđĐ\s-]/g, '')
    .split(/\s+/).filter(Boolean).map(toTelexWord).join('-');
}

export async function lookupWeddingInvitation(code: string, name: string, side: string) {
  if (!/^[A-Za-z0-9_-]{12}$/.test(code)) return null;
  if (name.length < 1 || name.length > 120) return null;

  const query = new URLSearchParams({
    select: 'id,invite_key,code_hash,display_name,side,is_active',
    code_hash: `eq.${hashInvitationCode(code)}`,
    is_active: 'eq.true',
    limit: '1'
  });
  const response = await supabaseServiceRequest(`wedding_invitations?${query}`);
  if (!response.ok) throw new Error(`Invitation lookup failed (${response.status})`);
  const [invitation] = await response.json() as WeddingInvitation[];
  if (!invitation || invitation.side !== side) return null;
  const normalizedName = normalizeInvitationName(name);
  const expectedName = normalizeInvitationName(invitation.display_name);
  const telexName = normalizeInvitationName(toTelexInvitationName(invitation.display_name));
  if (normalizedName !== expectedName && normalizedName !== telexName) return null;
  return invitation;
}
