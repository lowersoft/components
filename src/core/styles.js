import hostCss from '../styles/host.scss?inline';
import themeCss from '../styles/themes.scss?inline';

const sheetsByCss = new Map();
const sheetsByClass = new WeakMap();

// One CSSStyleSheet per distinct CSS string, shared by every class that uses it.
const toSheet = (css) => {
  let sheet = sheetsByCss.get(css);
  if (!sheet) {
    sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    sheetsByCss.set(css, sheet);
  }
  return sheet;
};

/**
 * Adopt the shared host sheet plus the class's own styles. `static styles`
 * may be a string or an array, so subclasses can extend a parent's styles.
 */
export const adoptStyles = (root, ctor) => {
  let sheets = sheetsByClass.get(ctor);
  if (!sheets) {
    sheets = [hostCss, ctor.styles].flat().filter(Boolean).map(toSheet);
    sheetsByClass.set(ctor, sheets);
  }
  root.adoptedStyleSheets = sheets;
};

/** Add page-level CSS (for selectors a shadow root cannot reach), once per string. */
export const adoptDocumentStyles = (css) => {
  const sheet = toSheet(css);
  if (!document.adoptedStyleSheets.includes(sheet)) {
    document.adoptedStyleSheets = [sheet, ...document.adoptedStyleSheets];
  }
};

/** Install the default theme tokens on the document. */
export const installTheme = () => adoptDocumentStyles(themeCss);
