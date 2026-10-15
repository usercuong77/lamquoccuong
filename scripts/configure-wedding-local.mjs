import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { emitKeypressEvents } from 'node:readline';

const envPath = new URL('../.env.local', import.meta.url);
const defaultSupabaseUrl = 'https://wabvabtlsfnrwuygdyls.supabase.co';

function askHidden(prompt) {
  if (!process.stdin.isTTY) throw new Error('Run this setup from the .bat file in an interactive terminal.');
  return new Promise(resolve => {
    process.stdout.write(prompt);
    let value = '';
    const stdin = process.stdin;
    const wasRaw = Boolean(stdin.isRaw);
    emitKeypressEvents(stdin);
    stdin.setRawMode(true);
    stdin.resume();
    const onKeypress = (character, key = {}) => {
      if (key.ctrl && key.name === 'c') process.exit(130);
      if (key.name === 'return' || key.name === 'enter') {
        stdin.off('keypress', onKeypress);
        stdin.setRawMode(wasRaw);
        stdin.pause();
        process.stdout.write('\n');
        resolve(value);
      } else if (key.name === 'backspace') {
        const characters = Array.from(value);
        if (characters.length) {
          characters.pop();
          value = characters.join('');
          process.stdout.write('\b \b');
        }
      } else if (!key.ctrl && !key.meta && character) {
        value += character;
        process.stdout.write('*'.repeat(Array.from(character).length));
      }
    };
    stdin.on('keypress', onKeypress);
  });
}

function getEnvValue(lines, name) {
  const line = lines.find(item => item.trimStart().startsWith(`${name}=`));
  return line?.slice(line.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '') || '';
}

function setEnvValue(lines, name, value) {
  const index = lines.findIndex(item => item.trimStart().startsWith(`${name}=`));
  const line = `${name}=${value}`;
  if (index >= 0) lines[index] = line;
  else lines.push(line);
}

let existing = '';
try { existing = await readFile(envPath, 'utf8'); } catch {}
const lines = existing.split(/\r?\n/).filter((line, index, all) => line || index < all.length - 1);
const oldKey = getEnvValue(lines, 'SUPABASE_SERVICE_ROLE_KEY');
const pastedKey = await askHidden('Paste Supabase secret key (sb_secret_...) or legacy service_role JWT (* shown; Enter keeps saved key): ');
const serviceKey = pastedKey.trim() || oldKey;
if (!serviceKey || /replace-with|YOUR_SUPABASE/i.test(serviceKey) || (!serviceKey.startsWith('sb_secret_') && !serviceKey.startsWith('eyJ'))) {
  console.error('Use the server secret key (sb_secret_...) or legacy service_role JWT (eyJ...). Do not use the publishable/anon key.');
  process.exit(1);
}

const sessionSecret = getEnvValue(lines, 'WEDDING_ADMIN_SESSION_SECRET') || randomBytes(48).toString('base64url');
setEnvValue(lines, 'SUPABASE_URL', getEnvValue(lines, 'SUPABASE_URL') || defaultSupabaseUrl);
setEnvValue(lines, 'SUPABASE_SERVICE_ROLE_KEY', serviceKey);
setEnvValue(lines, 'WEDDING_ADMIN_SESSION_SECRET', sessionSecret);
await writeFile(envPath, `${lines.filter(Boolean).join('\n')}\n`, { mode: 0o600 });
console.log('Local environment saved to .env.local. Session secret was generated locally if one was not already set.');
console.log('Restart the local Next.js server before testing. Do not commit or share .env.local.');
