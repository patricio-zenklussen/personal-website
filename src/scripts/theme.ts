const THEMES = ['cyan', 'amber', 'matrix', 'lavender', 'paper'] as const;
type Theme = (typeof THEMES)[number];

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const SCRAMBLE_STEPS = 5;
const SCRAMBLE_INTERVAL = 40;

function getCurrentTheme(): Theme {
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored && THEMES.includes(stored)) return stored;
  return 'cyan';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
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
    const idx = THEMES.indexOf(current);
    current = THEMES[(idx + 1) % THEMES.length];
    applyTheme(current);
    updateLabel(true);
  });
}
