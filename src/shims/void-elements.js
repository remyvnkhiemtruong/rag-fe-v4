/**
 * Shim: void-elements (CJS) không có default export trong ESM.
 * Copy nội dung từ void-elements để html-parse-stringify / remark-gfm dùng được.
 */
export default {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true,
};
