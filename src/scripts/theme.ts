const THEMES = ['tealos', 'phospo', 'lavend', 'papers', 'catpuc', 'forest', 'amoled'] as const;
type Theme = (typeof THEMES)[number];
const THEME_ROTATION: Theme[] = ['tealos', 'phospo', 'lavend', 'papers', 'catpuc', 'forest', 'amoled'];
const ROTATION_INDEX_KEY = 'theme-rotation-index';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const SCRAMBLE_STEPS = 5;
const SCRAMBLE_INTERVAL = 40;

const LEGACY_THEME_ALIASES: Record<string, Theme> = {
  cyan: 'tealos',
  amber: 'phospo',
  p3phos: 'phospo',
  lavender: 'lavend',
  paper: 'papers',
  matrix: 'tealos',
};

const FAVICON_COLORS: Record<Theme, string> = {
  tealos: '#e7f8f2',
  phospo: '#ffeed0',
  lavend: '#443269',
  papers: '#2b1b17',
  catpuc: '#f6e4df',
  forest: '#f3e8cf',
  amoled: '#f5f5f5',
};

function updateFavicon(theme: Theme) {
  const iconEl = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
  if (!iconEl) return;
  const color = FAVICON_COLORS[theme];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text x="2" y="26" font-family="monospace" font-size="28" font-weight="700" fill="${color}">P</text></svg>`;
  iconEl.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function normalizeTheme(value: string | null): Theme | null {
  if (!value) return null;
  if (THEMES.includes(value as Theme)) return value as Theme;
  return LEGACY_THEME_ALIASES[value] ?? null;
}

function getCurrentTheme(): Theme {
  const normalized = normalizeTheme(localStorage.getItem('theme'));
  if (normalized) return normalized;
  return 'amoled';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateFavicon(theme);
}

function getRotationIndexForTheme(theme: Theme): number {
  const idx = THEME_ROTATION.lastIndexOf(theme);
  return idx >= 0 ? idx : 0;
}

function scrambleLabel(el: HTMLElement, finalText: string) {
  let step = 0;
  const len = finalText.length;
  const interval = setInterval(() => {
    let txt = '';
    for (let i = 0; i < len; i++) {
      txt += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
    el.textContent = txt;
    step++;
    if (step >= SCRAMBLE_STEPS) {
      clearInterval(interval);
      el.textContent = finalText;
    }
  }, SCRAMBLE_INTERVAL);
}

export function initThemeSwitcher(btn: HTMLElement, label?: HTMLElement) {
  let current = getCurrentTheme();
  let rotationIndex = Number.parseInt(localStorage.getItem(ROTATION_INDEX_KEY) ?? '', 10);
  if (Number.isNaN(rotationIndex) || THEME_ROTATION[rotationIndex] !== current) {
    rotationIndex = getRotationIndexForTheme(current);
  }
  applyTheme(current);
  localStorage.setItem(ROTATION_INDEX_KEY, String(rotationIndex));

  function updateLabel(animate = false) {
    if (!label) return;
    const text = current.toUpperCase();
    if (animate) {
      scrambleLabel(label, text);
    } else {
      label.textContent = text;
    }
  }

  updateLabel();

  btn.addEventListener('click', () => {
    rotationIndex = (rotationIndex + 1) % THEME_ROTATION.length;
    current = THEME_ROTATION[rotationIndex];
    applyTheme(current);
    localStorage.setItem(ROTATION_INDEX_KEY, String(rotationIndex));
    updateLabel(true);
  });
}
