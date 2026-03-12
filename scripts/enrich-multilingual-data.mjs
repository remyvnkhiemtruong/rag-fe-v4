import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const postQuizPath = path.join(rootDir, 'src', 'data', 'postReadingQuizzes.js');
const tagsPath = path.join(rootDir, 'src', 'data', 'tags.js');
const gamificationPath = path.join(rootDir, 'src', 'context', 'GamificationContext.jsx');

const translatorCache = new Map();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function translateText(text, target) {
  const normalized = String(text ?? '').trim();
  if (!normalized) return '';

  const key = `${target}::${normalized}`;
  if (translatorCache.has(key)) {
    return translatorCache.get(key);
  }

  // Keep pure numeric/date-like values unchanged.
  if (/^[0-9/.,:()\-\s+%]+$/.test(normalized)) {
    translatorCache.set(key, normalized);
    return normalized;
  }

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(target)}&dt=t&q=${encodeURIComponent(normalized)}`;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      const translated = (data?.[0] || []).map((segment) => segment?.[0] || '').join('').trim() || normalized;
      translatorCache.set(key, translated);
      return translated;
    } catch (error) {
      if (attempt === 2) {
        console.warn(`Translate fallback for target=${target}:`, normalized);
        translatorCache.set(key, normalized);
        return normalized;
      }
      await sleep(250 * (attempt + 1));
    }
  }

  translatorCache.set(key, normalized);
  return normalized;
}

function escapeSingleQuote(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, ' ')
    .trim();
}

function emitString(value) {
  return `'${escapeSingleQuote(value)}'`;
}

function emitArray(values = []) {
  return `[${values.map((value) => emitString(value)).join(', ')}]`;
}

async function enrichPostReadingQuizzes() {
  const module = await import(pathToFileURL(postQuizPath).href);
  const sourceData = module.postReadingQuizzes;

  const keys = Object.keys(sourceData).sort((a, b) => {
    if (a === 'default') return 1;
    if (b === 'default') return -1;
    return Number(a) - Number(b);
  });

  for (const key of keys) {
    const quiz = sourceData[key];
    if (!quiz?.questions) continue;

    for (const question of quiz.questions) {
      const questionBase = question.questionEn || question.question || '';
      const explanationBase = question.explanationEn || question.explanation || '';

      if (!question.questionZh) {
        question.questionZh = await translateText(questionBase, 'zh-TW');
      }
      if (!question.questionKm) {
        question.questionKm = await translateText(questionBase, 'km');
      }

      if (Array.isArray(question.options)) {
        const optionBase = Array.isArray(question.optionsEn) && question.optionsEn.length === question.options.length
          ? question.optionsEn
          : question.options;

        if (!Array.isArray(question.optionsZh) || question.optionsZh.length !== question.options.length) {
          question.optionsZh = [];
          for (const option of optionBase) {
            question.optionsZh.push(await translateText(option, 'zh-TW'));
          }
        }

        if (!Array.isArray(question.optionsKm) || question.optionsKm.length !== question.options.length) {
          question.optionsKm = [];
          for (const option of optionBase) {
            question.optionsKm.push(await translateText(option, 'km'));
          }
        }
      }

      if (!question.explanationZh) {
        question.explanationZh = await translateText(explanationBase, 'zh-TW');
      }
      if (!question.explanationKm) {
        question.explanationKm = await translateText(explanationBase, 'km');
      }
    }
  }

  const lines = [];
  lines.push('/**');
  lines.push(' * Post-Reading Quizzes Data');
  lines.push(' * Short quizzes that appear after viewing heritage details');
  lines.push(' * Tests user comprehension and awards bonus points');
  lines.push(' */');
  lines.push('');
  lines.push('export const postReadingQuizzes = {');

  for (const key of keys) {
    const quiz = sourceData[key];
    const keyLabel = /^\d+$/.test(key) ? key : key;
    lines.push(`  ${keyLabel}: {`);
    lines.push(`    heritageId: ${quiz.heritageId},`);
    lines.push(`    heritageName: ${emitString(quiz.heritageName || '')},`);
    lines.push('    questions: [');

    for (const question of quiz.questions) {
      lines.push('      {');
      lines.push(`        id: ${emitString(question.id)},`);
      lines.push(`        type: ${emitString(question.type)},`);
      lines.push(`        question: ${emitString(question.question || '')},`);
      lines.push(`        questionEn: ${emitString(question.questionEn || question.question || '')},`);
      lines.push(`        questionZh: ${emitString(question.questionZh || '')},`);
      lines.push(`        questionKm: ${emitString(question.questionKm || '')},`);

      if (Array.isArray(question.options)) {
        lines.push(`        options: ${emitArray(question.options)},`);
        const optionsEn = Array.isArray(question.optionsEn) ? question.optionsEn : question.options;
        lines.push(`        optionsEn: ${emitArray(optionsEn)},`);
        const optionsZh = Array.isArray(question.optionsZh) ? question.optionsZh : question.options;
        const optionsKm = Array.isArray(question.optionsKm) ? question.optionsKm : question.options;
        lines.push(`        optionsZh: ${emitArray(optionsZh)},`);
        lines.push(`        optionsKm: ${emitArray(optionsKm)},`);
        lines.push(`        correct: ${question.correct},`);
      } else {
        lines.push(`        correct: ${question.correct},`);
      }

      lines.push(`        explanation: ${emitString(question.explanation || '')},`);
      lines.push(`        explanationEn: ${emitString(question.explanationEn || question.explanation || '')},`);
      lines.push(`        explanationZh: ${emitString(question.explanationZh || '')},`);
      lines.push(`        explanationKm: ${emitString(question.explanationKm || '')},`);
      lines.push('      },');
    }

    lines.push('    ],');
    lines.push('  },');
    lines.push('');
  }

  lines.push('};');
  lines.push('');
  lines.push('/**');
  lines.push(' * Get quiz for a specific heritage');
  lines.push(' * @param {number} heritageId - Heritage ID');
  lines.push(' * @returns {Object} Quiz data');
  lines.push(' */');
  lines.push('export function getQuizForHeritage(heritageId) {');
  lines.push('  return postReadingQuizzes[heritageId] || postReadingQuizzes.default;');
  lines.push('}');
  lines.push('');
  lines.push('/**');
  lines.push(' * Get random question from a heritage quiz');
  lines.push(' * @param {number} heritageId - Heritage ID');
  lines.push(' * @param {number} count - Number of questions to get');
  lines.push(' * @returns {Array} Array of questions');
  lines.push(' */');
  lines.push('export function getRandomQuestions(heritageId, count = 2) {');
  lines.push('  const quiz = getQuizForHeritage(heritageId);');
  lines.push('  const questions = [...quiz.questions];');
  lines.push('');
  lines.push('  // Shuffle and take count questions');
  lines.push('  for (let i = questions.length - 1; i > 0; i -= 1) {');
  lines.push('    const j = Math.floor(Math.random() * (i + 1));');
  lines.push('    [questions[i], questions[j]] = [questions[j], questions[i]];');
  lines.push('  }');
  lines.push('');
  lines.push('  return questions.slice(0, Math.min(count, questions.length));');
  lines.push('}');
  lines.push('');
  lines.push('/**');
  lines.push(' * Check if a heritage has specific quiz questions');
  lines.push(' * @param {number} heritageId - Heritage ID');
  lines.push(' * @returns {boolean}');
  lines.push(' */');
  lines.push('export function hasCustomQuiz(heritageId) {');
  lines.push("  return heritageId in postReadingQuizzes && heritageId !== 'default';");
  lines.push('}');
  lines.push('');
  lines.push('export default postReadingQuizzes;');

  await fs.writeFile(postQuizPath, `${lines.join('\n')}\n`, 'utf8');
}

async function enrichTags() {
  const module = await import(pathToFileURL(tagsPath).href);
  const categories = module.TAG_CATEGORIES;
  const tags = module.TAGS_DATA;

  for (const category of categories) {
    const baseText = category.nameEn || category.name;
    if (!category.nameZh) {
      category.nameZh = await translateText(baseText, 'zh-TW');
    }
    if (!category.nameKm) {
      category.nameKm = await translateText(baseText, 'km');
    }
  }

  for (const tag of tags) {
    const baseText = tag.nameEn || tag.name;
    if (!tag.nameZh) {
      tag.nameZh = await translateText(baseText, 'zh-TW');
    }
    if (!tag.nameKm) {
      tag.nameKm = await translateText(baseText, 'km');
    }
  }

  const lines = [];
  lines.push('// Tags data for Local Education System');
  lines.push('// Categories: heritage, people, festival, location, period, topic');
  lines.push('');
  lines.push('export const TAG_CATEGORIES = [');
  for (const category of categories) {
    lines.push(
      `  { id: ${emitString(category.id)}, name: ${emitString(category.name)}, nameEn: ${emitString(category.nameEn)}, nameZh: ${emitString(category.nameZh)}, nameKm: ${emitString(category.nameKm)}, color: ${emitString(category.color)} },`
    );
  }
  lines.push('];');
  lines.push('');
  lines.push('export const TAGS_DATA = [');
  for (const tag of tags) {
    lines.push(
      `  { id: ${tag.id}, name: ${emitString(tag.name)}, nameEn: ${emitString(tag.nameEn)}, nameZh: ${emitString(tag.nameZh)}, nameKm: ${emitString(tag.nameKm)}, category: ${emitString(tag.category)}, color: ${emitString(tag.color)} },`
    );
  }
  lines.push('];');
  lines.push('');
  lines.push('// Helper function to get tags by category');
  lines.push('export const getTagsByCategory = (category) => {');
  lines.push('  return TAGS_DATA.filter((tag) => tag.category === category);');
  lines.push('};');
  lines.push('');
  lines.push('// Helper function to get tag by ID');
  lines.push('export const getTagById = (id) => {');
  lines.push('  return TAGS_DATA.find((tag) => tag.id === id);');
  lines.push('};');
  lines.push('');
  lines.push('// Helper function to get category info');
  lines.push('export const getCategoryInfo = (categoryId) => {');
  lines.push('  return TAG_CATEGORIES.find((cat) => cat.id === categoryId);');
  lines.push('};');
  lines.push('');
  lines.push('// Helper function to search tags');
  lines.push('export const searchTags = (query) => {');
  lines.push('  const lowerQuery = query.toLowerCase();');
  lines.push('  return TAGS_DATA.filter((tag) =>');
  lines.push('    tag.name.toLowerCase().includes(lowerQuery) ||');
  lines.push('    tag.nameEn.toLowerCase().includes(lowerQuery) ||');
  lines.push('    (tag.nameZh || \"\").toLowerCase().includes(lowerQuery) ||');
  lines.push('    (tag.nameKm || \"\").toLowerCase().includes(lowerQuery)');
  lines.push('  );');
  lines.push('};');
  lines.push('');
  lines.push('export default TAGS_DATA;');

  await fs.writeFile(tagsPath, `${lines.join('\n')}\n`, 'utf8');
}

async function enrichGamificationContext() {
  let content = await fs.readFile(gamificationPath, 'utf8');

  const nameMatches = [...content.matchAll(/nameEn:\s*'([^']*)',/g)];
  for (const match of nameMatches) {
    const full = match[0];
    const sourceText = match[1];
    const replacementPrefix = `${full} nameZh:`;
    if (content.includes(replacementPrefix)) {
      continue;
    }

    const zh = await translateText(sourceText, 'zh-TW');
    const km = await translateText(sourceText, 'km');
    const replacement = `nameEn: '${escapeSingleQuote(sourceText)}', nameZh: '${escapeSingleQuote(zh)}', nameKm: '${escapeSingleQuote(km)}',`;
    content = content.replace(full, replacement);
  }

  const descriptionMatches = [...content.matchAll(/descriptionEn:\s*'([^']*)',/g)];
  for (const match of descriptionMatches) {
    const full = match[0];
    const sourceText = match[1];
    const replacementPrefix = `${full} descriptionZh:`;
    if (content.includes(replacementPrefix)) {
      continue;
    }

    const zh = await translateText(sourceText, 'zh-TW');
    const km = await translateText(sourceText, 'km');
    const replacement = `descriptionEn: '${escapeSingleQuote(sourceText)}', descriptionZh: '${escapeSingleQuote(zh)}', descriptionKm: '${escapeSingleQuote(km)}',`;
    content = content.replace(full, replacement);
  }

  await fs.writeFile(gamificationPath, content, 'utf8');
}

(async () => {
  console.log('Enriching postReadingQuizzes...');
  await enrichPostReadingQuizzes();

  console.log('Enriching tags...');
  await enrichTags();

  console.log('Enriching gamification context...');
  await enrichGamificationContext();

  console.log('Done.');
})();
