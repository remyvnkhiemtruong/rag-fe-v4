import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const SRC_DIR = path.join(ROOT_DIR, 'src');
const SOURCE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);

const IGNORED_PATH_SEGMENTS = [
  `${path.sep}i18n${path.sep}locales${path.sep}`,
  `${path.sep}data${path.sep}heritages_backup_`,
  `${path.sep}dist${path.sep}`,
];

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

const shouldIgnoreFile = (filePath) => IGNORED_PATH_SEGMENTS.some((segment) => filePath.includes(segment));
const isDataFile = (filePath) => filePath.includes(`${path.sep}data${path.sep}`);

const issues = [];

const addIssue = (type, filePath, line, detail) => {
  issues.push({
    type,
    filePath: path.relative(ROOT_DIR, filePath),
    line,
    detail,
  });
};

const readLines = (filePath) => fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

const lineHasLikelyHumanText = (value) => {
  if (!value) return false;
  if (/^[A-Za-z0-9_-]+$/.test(value)) return false;
  if (/^https?:\/\//.test(value)) return false;
  return /[A-Za-zÀ-ỹ\u4E00-\u9FFF\u1780-\u17FF]/.test(value);
};

const looksLikeTranslationKey = (value) => /^[a-z0-9_.-]+$/i.test(value);
const looksLikeCssTokens = (value) => {
  const tokens = value.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return false;
  return tokens.every((token) => /^[!#%(),./:[\]A-Za-z0-9_-]+$/.test(token));
};
const looksLikeOnlyCodeOrPunctuation = (value) => /^[\d\s()[\]{}<>/%+*=,.:;_-]+$/.test(value);

const scanHardcodedStrings = (filePath) => {
  if (isDataFile(filePath)) return;

  const lines = readLines(filePath);
  let inBlockComment = false;

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i];
    let line = rawLine;

    if (inBlockComment) {
      const closeIndex = line.indexOf('*/');
      if (closeIndex === -1) {
        continue;
      }
      line = line.slice(closeIndex + 2);
      inBlockComment = false;
    }

    while (line.includes('/*')) {
      const start = line.indexOf('/*');
      const end = line.indexOf('*/', start + 2);
      if (end === -1) {
        line = line.slice(0, start);
        inBlockComment = true;
        break;
      }
      line = `${line.slice(0, start)} ${line.slice(end + 2)}`;
    }

    if (!line.trim() || line.trim().startsWith('//')) {
      continue;
    }

    if (/\bisVietnamese\b/.test(line)) {
      addIssue('vi-en-branch', filePath, i + 1, 'Found legacy isVietnamese branch.');
    }

    if (/\blanguage\s*===\s*['"]vi['"]/.test(line) && line.includes('?')) {
      addIssue('vi-en-branch', filePath, i + 1, 'Found language===vi ternary branch.');
    }

    const ternaryRegex = /\?\s*(['"`])([^'"`]+)\1\s*:\s*(['"`])([^'"`]+)\3/g;
    let ternaryMatch;
    while ((ternaryMatch = ternaryRegex.exec(line)) !== null) {
      const left = ternaryMatch[2].trim();
      const right = ternaryMatch[4].trim();

      if (/className\s*=|style\s*=/.test(line)) continue;
      if (left.includes('${') || right.includes('${')) continue;
      if ((looksLikeCssTokens(left) && looksLikeCssTokens(right))) continue;
      if (looksLikeTranslationKey(left) && looksLikeTranslationKey(right)) continue;
      if (looksLikeOnlyCodeOrPunctuation(left) && looksLikeOnlyCodeOrPunctuation(right)) continue;
      if (!lineHasLikelyHumanText(left) && !lineHasLikelyHumanText(right)) continue;

      addIssue('hardcoded-ternary', filePath, i + 1, `Hardcoded ternary strings: "${left}" : "${right}"`);
    }

    const attributeRegex = /\b(?:aria-label|placeholder|title)\s*=\s*['"]([^'"]+)['"]/g;
    let attributeMatch;
    while ((attributeMatch = attributeRegex.exec(line)) !== null) {
      const value = attributeMatch[1].trim();
      if (!lineHasLikelyHumanText(value)) continue;
      if (looksLikeTranslationKey(value)) continue;
      addIssue('hardcoded-attribute', filePath, i + 1, `Hardcoded attribute text: "${value}"`);
    }

    const jsxTextRegex = />([^<>{}]+)</g;
    let jsxMatch;
    while ((jsxMatch = jsxTextRegex.exec(line)) !== null) {
      const value = jsxMatch[1].replace(/\s+/g, ' ').trim();
      if (!value) continue;
      if (/(&&|\|\||===|<=|>=|=>)/.test(value)) continue;
      if (!lineHasLikelyHumanText(value)) continue;
      if (looksLikeTranslationKey(value)) continue;
      if (looksLikeOnlyCodeOrPunctuation(value)) continue;
      addIssue('hardcoded-jsx', filePath, i + 1, `Hardcoded JSX text: "${value}"`);
    }

    const dialogRegex = /\b(?:window\.)?(?:confirm|alert|prompt)\(\s*['"]([^'"]+)['"]/g;
    let dialogMatch;
    while ((dialogMatch = dialogRegex.exec(line)) !== null) {
      const value = dialogMatch[1].trim();
      if (!lineHasLikelyHumanText(value)) continue;
      if (looksLikeTranslationKey(value)) continue;
      addIssue('hardcoded-dialog', filePath, i + 1, `Hardcoded dialog text: "${value}"`);
    }
  }
};

const extractObjectBlocks = (source) => {
  const blocks = [];
  const stack = [];

  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;

  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (ch === '\\') {
      escaped = true;
      continue;
    }

    if (!inDouble && !inTemplate && ch === "'") {
      inSingle = !inSingle;
      continue;
    }

    if (!inSingle && !inTemplate && ch === '"') {
      inDouble = !inDouble;
      continue;
    }

    if (!inSingle && !inDouble && ch === '`') {
      inTemplate = !inTemplate;
      continue;
    }

    if (inSingle || inDouble || inTemplate) continue;

    if (ch === '{') {
      stack.push(i);
      continue;
    }

    if (ch === '}') {
      const start = stack.pop();
      if (start !== undefined && stack.length === 0) {
        blocks.push({ start, end: i + 1, text: source.slice(start, i + 1) });
      }
    }
  }

  return blocks;
};

const indexToLineNumber = (text, index) => text.slice(0, index).split(/\r?\n/).length;

const scanMissingZhKmCompanions = (filePath) => {
  const source = fs.readFileSync(filePath, 'utf8');
  const blocks = extractObjectBlocks(source);

  for (const block of blocks) {
    const enMatches = [...block.text.matchAll(/\b([A-Za-z_][A-Za-z0-9_]*)En\s*:/g)];
    if (enMatches.length === 0) continue;

    const bases = [...new Set(enMatches.map((match) => match[1]))];
    for (const base of bases) {
      const hasZh = new RegExp(`\\b${base}Zh\\s*:`).test(block.text);
      const hasKm = new RegExp(`\\b${base}Km\\s*:`).test(block.text);
      if (hasZh && hasKm) continue;

      const line = indexToLineNumber(source, block.start);
      addIssue(
        'missing-zh-km',
        filePath,
        line,
        `Object has ${base}En but missing ${!hasZh ? `${base}Zh` : ''}${!hasZh && !hasKm ? ' and ' : ''}${!hasKm ? `${base}Km` : ''}.`
      );
    }
  }
};

const files = collectSourceFiles(SRC_DIR).filter((filePath) => !shouldIgnoreFile(filePath));

for (const filePath of files) {
  scanHardcodedStrings(filePath);
  scanMissingZhKmCompanions(filePath);
}

if (issues.length > 0) {
  console.error(`Found ${issues.length} i18n audit issue(s):`);
  for (const issue of issues) {
    console.error(`- [${issue.type}] ${issue.filePath}:${issue.line} ${issue.detail}`);
  }
  process.exitCode = 1;
} else {
  console.log('i18n audit passed (0 issues).');
}
