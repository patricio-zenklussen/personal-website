type Panel = 'about' | 'blog' | 'about-site' | null;

interface NavigationState {
  activePanel: Panel;
  activeDetail: string | null;
  activeCategory: string;
}

const state: NavigationState = {
  activePanel: null,
  activeDetail: null,
  activeCategory: 'all',
};

const ANIM_MS = 200;
const FADE_MS = 150;

let col2El: HTMLElement;
let col2Inner: HTMLElement;
let col3El: HTMLElement;
let panels: Record<string, HTMLElement>;
let detailEl: HTMLElement;

const closeTimers = new Map<HTMLElement, number>();
let sequenceTimer: number | null = null;

function clearSequence() {
  if (sequenceTimer !== null) {
    clearTimeout(sequenceTimer);
    sequenceTimer = null;
  }
}

function openColumn(el: HTMLElement) {
  const pending = closeTimers.get(el);
  if (pending) {
    clearTimeout(pending);
    closeTimers.delete(el);
  }
  el.classList.remove('is-closing');
  el.classList.add('is-visible');
}

function closeColumn(el: HTMLElement) {
  if (!el.classList.contains('is-visible')) return;

  el.classList.add('is-closing');
  el.classList.remove('is-visible');

  const timer = window.setTimeout(() => {
    closeTimers.delete(el);
    el.style.transition = 'none';
    el.classList.remove('is-closing');
    void el.offsetHeight;
    el.style.transition = '';
  }, ANIM_MS);

  closeTimers.set(el, timer);
}

function isCol3Open() {
  return col3El.classList.contains('is-visible');
}

function clearDetailHighlights() {
  document.querySelectorAll<HTMLElement>('[data-post]').forEach((el) => {
    el.classList.remove('active');
  });
  document.querySelectorAll<HTMLElement>('[data-detail-trigger]').forEach((el) => {
    el.classList.remove('active');
  });
}

function updateNavHighlight() {
  document.querySelectorAll<HTMLElement>('[data-nav]').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === state.activePanel);
  });
}

function focusPanel(panel: Panel) {
  const panelEl = panel ? panels[panel] : null;
  if (panelEl) {
    const target = panelEl.querySelector<HTMLElement>('h2[tabindex], a, button');
    if (target) target.focus({ preventScroll: true });
  }
}

function switchPanelContent(panel: Panel) {
  for (const [key, el] of Object.entries(panels)) {
    el.style.display = key === panel ? 'block' : 'none';
  }
}

function fadeSwitchPanel(panel: Panel, callback?: () => void) {
  col2Inner.style.opacity = '0';
  setTimeout(() => {
    switchPanelContent(panel);
    requestAnimationFrame(() => {
      col2Inner.style.opacity = '1';
    });
    if (callback) setTimeout(callback, FADE_MS);
  }, FADE_MS);
}

function showCol2(panel: Panel) {
  clearSequence();

  if (panel === state.activePanel) {
    hideCol2();
    return;
  }

  const col2WasVisible = col2El.classList.contains('is-visible');
  const col3WasOpen = isCol3Open();

  state.activePanel = panel;
  state.activeDetail = null;
  clearDetailHighlights();
  updateNavHighlight();

  if (col3WasOpen) {
    closeColumn(col3El);
    sequenceTimer = window.setTimeout(() => {
      sequenceTimer = null;
      fadeSwitchPanel(panel, () => focusPanel(panel));
    }, ANIM_MS);
  } else if (col2WasVisible) {
    fadeSwitchPanel(panel, () => focusPanel(panel));
  } else {
    switchPanelContent(panel);
    openColumn(col2El);
    focusPanel(panel);
  }
}

function hideCol2() {
  clearSequence();

  state.activePanel = null;
  state.activeDetail = null;
  clearDetailHighlights();

  if (isCol3Open()) {
    closeColumn(col3El);
    sequenceTimer = window.setTimeout(() => {
      sequenceTimer = null;
      closeColumn(col2El);
      updateNavHighlight();
    }, ANIM_MS);
  } else {
    closeColumn(col2El);
    updateNavHighlight();
  }
}

function hideCol3() {
  state.activeDetail = null;
  closeColumn(col3El);
  clearDetailHighlights();
}

function showDetail(id: string) {
  const template = document.getElementById(`template-${id}`) as HTMLTemplateElement | null;
  if (!template) return;

  state.activeDetail = id;

  const col3WasOpen = isCol3Open();

  document.querySelectorAll<HTMLElement>('[data-post]').forEach((el) => {
    el.classList.toggle('active', el.dataset.post === id);
  });
  document.querySelectorAll<HTMLElement>('[data-detail-trigger]').forEach((el) => {
    el.classList.toggle('active', el.dataset.detailTrigger === id);
  });

  const loadContent = () => {
    detailEl.innerHTML = '';
    detailEl.appendChild(template.content.cloneNode(true));

    const heading = detailEl.querySelector<HTMLElement>('h1, h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  };

  if (col3WasOpen) {
    detailEl.style.opacity = '0';
    setTimeout(() => {
      loadContent();
      requestAnimationFrame(() => {
        detailEl.style.opacity = '1';
      });
    }, FADE_MS);
  } else {
    loadContent();
    openColumn(col3El);

    if (window.innerWidth <= 768) {
      col3El.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

function filterPosts(category: string) {
  state.activeCategory = category;

  document.querySelectorAll<HTMLElement>('[data-filter]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === category);
  });

  document.querySelectorAll<HTMLElement>('[data-post]').forEach((item) => {
    const li = item.closest('li') as HTMLElement | null;
    if (!li) return;
    const postCat = item.dataset.category ?? '';
    li.style.display = (category === 'all' || postCat === category) ? '' : 'none';
  });
}

export function initNavigation() {
  col2El = document.getElementById('col-2')!;
  col2Inner = document.getElementById('col-2-inner')!;
  col3El = document.getElementById('col-3')!;
  detailEl = document.getElementById('detail-content')!;

  panels = {
    about: document.getElementById('panel-about')!,
    blog: document.getElementById('panel-blog')!,
    'about-site': document.getElementById('panel-about-site')!,
  };

  document.querySelectorAll<HTMLElement>('[data-nav]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.nav as Panel;
      showCol2(target);

      if (window.innerWidth <= 768 && state.activePanel) {
        col2El.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-post]');
    if (target) {
      e.preventDefault();
      showDetail(target.dataset.post!);
    }
  });

  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-detail-trigger]');
    if (target) {
      e.preventDefault();
      showDetail(target.dataset.detailTrigger!);
    }
  });

  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-filter]');
    if (target) {
      e.preventDefault();
      filterPosts(target.dataset.filter!);
    }
  });

  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-back]');
    if (target) {
      e.preventDefault();
      const level = target.dataset.back;
      if (level === 'col3') {
        hideCol3();
      } else if (level === 'col2') {
        hideCol2();
      }
    }
  });
}
