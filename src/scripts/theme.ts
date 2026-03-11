const THEMES = ['cyan', 'amber', 'matrix', 'lavender', 'paper'] as const;
type Theme = (typeof THEMES)[number];

function getCurrentTheme(): Theme {
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored && THEMES.includes(stored)) return stored;
  return 'cyan';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

export function initThemeSwitcher(btn: HTMLElement, label?: HTMLElement) {
  let current = getCurrentTheme();

  function updateLabel() {
    if (label) label.textContent = current.toUpperCase();
  }

  updateLabel();

  btn.addEventListener('click', () => {
    const idx = THEMES.indexOf(current);
    current = THEMES[(idx + 1) % THEMES.length];
    applyTheme(current);
    updateLabel();
  });
}
