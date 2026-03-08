import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const SRC_DIR = path.join(ROOT_DIR, 'src');
const LOCALE_DIR = path.join(SRC_DIR, 'i18n', 'locales');
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const LOCALES = ['vi', 'en', 'zh', 'km'];

const KEY_CALL_REGEX = /\b(?:t|i18n\.t)\(\s*(['"`])([^'"`]+)\1/g;
const TRANS_REGEX = /<Trans[^>]*\bi18nKey=(['"`])([^'"`]+)\1/g;

const shouldIgnoreKey = (key) =>
  !key ||
  key.includes('${') ||
  key.startsWith('./') ||
  key.startsWith('../') ||
  key.startsWith('/');

const collectSourceFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(fullPath));
      continue;
    }

    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
};

const hasNestedKey = (target, dottedKey) => {
  const parts = dottedKey.split('.');
  let current = target;

  for (const part of parts) {
    if (!current || typeof current !== 'object' || !Object.prototype.hasOwnProperty.call(current, part)) {
      return false;
    }
    current = current[part];
  }

  return true;
};

const collectKeys = (files) => {
  const keyUsage = new Map();

  for (const filePath of files) {
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
      const line = lines[lineIndex];
      for (const regex of [KEY_CALL_REGEX, TRANS_REGEX]) {
        regex.lastIndex = 0;
        let match;
        while ((match = regex.exec(line)) !== null) {
          const key = match[2].trim();
          if (shouldIgnoreKey(key)) continue;

          const usageList = keyUsage.get(key) ?? [];
          usageList.push(`${path.relative(ROOT_DIR, filePath)}:${lineIndex + 1}`);
          keyUsage.set(key, usageList);
        }
      }
    }
  }

  return keyUsage;
};

const sourceFiles = collectSourceFiles(SRC_DIR);
const keyUsage = collectKeys(sourceFiles);
const keys = [...keyUsage.keys()].sort();

let hasMissing = false;

for (const locale of LOCALES) {
  const localePath = path.join(LOCALE_DIR, `${locale}.json`);
  const localeObject = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  const missingKeys = keys.filter((key) => !hasNestedKey(localeObject, key));

  if (missingKeys.length === 0) {
    console.log(`[${locale}] OK (${keys.length} keys checked)`);
    continue;
  }

  hasMissing = true;
  console.error(`[${locale}] Missing ${missingKeys.length} keys:`);
  for (const key of missingKeys) {
    const firstUsage = keyUsage.get(key)?.[0] ?? 'unknown';
    console.error(`  - ${key} (first seen at ${firstUsage})`);
  }
}

if (hasMissing) {
  process.exitCode = 1;
}

