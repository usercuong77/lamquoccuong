import { randomBytes, scryptSync } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { createInterface, emitKeypressEvents } from 'node:readline';

const credentialsPath = new URL('../private/admin-credentials.txt', import.meta.url);

function ask(prompt, hidden = false) {
  if (!hidden) {
    return new Promise(resolve => {
      const readline = createInterface({ input: process.stdin, output: process.stdout });
      readline.question(prompt, answer => {
        readline.close();
        resolve(answer);
      });
    });
  }
  return new Promise(resolve => {
    process.stdout.write(prompt);
    let value = '';
    const stdin = process.stdin;
    const wasRaw = Boolean(stdin.isRaw);
    emitKeypressEvents(stdin);
    if (stdin.isTTY) stdin.setRawMode(true);
    stdin.resume();
    const onKeypress = (character, key = {}) => {
      if (key.ctrl && key.name === 'c') {
        process.stdout.write('\nCancelled.\n');
        process.exit(130);
      }
      if (key.name === 'return' || key.name === 'enter') {
        stdin.off('keypress', onKeypress);
        if (stdin.isTTY) stdin.setRawMode(wasRaw);
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

if (!process.stdin.isTTY) {
  console.error('Run this command in an interactive terminal so the password is not exposed.');
  process.exit(1);
}

const username = (await ask('Username (3-40 chars, letters/numbers/._-): ')).trim();
if (!/^[a-zA-Z0-9._-]{3,40}$/.test(username)) {
  console.error('Invalid username format.');
  process.exit(1);
}

const password = await ask('New password (any non-empty password, hidden): ', true);
if (password.length < 1 || password.length > 1024) {
  console.error('Password must not be empty.');
  process.exit(1);
}
const confirmation = await ask('Confirm password (hidden): ', true);
if (password !== confirmation) {
  console.error('Passwords do not match.');
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);
const record = `${username}|scrypt|${salt.toString('hex')}|${hash.toString('hex')}`;
let existing = '';
try {
  existing = await readFile(credentialsPath, 'utf8');
} catch {}
const lines = existing.split(/\r?\n/).filter(line => line.trim() && !line.trimStart().startsWith('#'));
const updated = lines.filter(line => line.split('|', 1)[0].toLowerCase() !== username.toLowerCase());
updated.push(record);
await writeFile(credentialsPath, `# username|scrypt|salt_hex|hash_hex\n${updated.join('\n')}\n`, { mode: 0o600 });
console.log(`Saved the password hash for "${username}" to private/admin-credentials.txt. The plaintext password was not saved.`);
