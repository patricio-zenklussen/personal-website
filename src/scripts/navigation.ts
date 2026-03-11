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

let col2El: HTMLElement;
let col3El: HTMLElement;
let panels: Record<string, HTMLElement>;
let detailEl: HTMLElement;

function updateNavHighlight() {
  document.querySelectorAll<HTMLElement>('[data-nav]').forEach((link) => {
    link.classList.toggle('active', link.dataset.nav === state.activePanel);
  });
}

function showCol2(panel: Panel) {
  if (panel === state.activePanel) {
    hideCol2();
    return;
  }

  state.activePanel = panel;
  state.activeDetail = null;

  for (const [key, el] of Object.entries(panels)) {
    el.style.display = key === panel ? 'block' : 'none';
  }

  col2El.classList.add('is-visible');
  hideCol3();
  updateNavHighlight();
}

function hideCol2() {
  state.activePanel = null;
  state.activeDetail = null;
  col2El.classList.remove('is-visible');
  hideCol3();
  updateNavHighlight();
}

function hideCol3() {
  state.activeDetail = null;
  col3El.classList.remove('is-visible');

  document.querySelectorAll<HTMLElement>('[data-post]').forEach((el) => {
    el.classList.remove('active');
  });
  document.querySelectorAll<HTMLElement>('[data-detail-trigger]').forEach((el) => {
    el.classList.remove('active');
  });
}

function showDetail(id: string) {
  state.activeDetail = id;

  const template = document.getElementById(`template-${id}`) as HTMLTemplateElement | null;
  if (!template) return;

  detailEl.innerHTML = '';
  const content = template.content.cloneNode(true);
  detailEl.appendChild(content);

  col3El.classList.add('is-visible');

  document.querySelectorAll<HTMLElement>('[data-post]').forEach((el) => {
    el.classList.toggle('active', el.dataset.post === id);
  });

  document.querySelectorAll<HTMLElement>('[data-detail-trigger]').forEach((el) => {
    el.classList.toggle('active', el.dataset.detailTrigger === id);
  });

  if (window.innerWidth <= 768) {
    col3El.scrollIntoView({ behavior: 'smooth' });
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
