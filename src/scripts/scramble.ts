const WORDS = [
  'RESEARCHER',
  'LISTENER',
  'LEARNER',
  'WRITER',
  'PHOTOGRAPHER',
  'READER',
  'WATCHER',
];

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const SCRAMBLE_DURATION = 600;
const STAGGER_PER_CHAR = 30;
const PAUSE_BETWEEN = 3000;
const TICK_INTERVAL = 35;

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

function scrambleTo(el: HTMLElement, word: string): Promise<void> {
  return new Promise((resolve) => {
    const maxLen = Math.max(el.textContent?.length ?? 0, word.length);
    const padded = word.padEnd(maxLen, ' ');
    const settled = new Array(maxLen).fill(false);
    const display = new Array(maxLen).fill(' ');
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      let allDone = true;

      for (let i = 0; i < maxLen; i++) {
        const charDeadline = SCRAMBLE_DURATION + i * STAGGER_PER_CHAR;

        if (elapsed >= charDeadline) {
          display[i] = padded[i];
          settled[i] = true;
        } else if (!settled[i]) {
          display[i] = randomChar();
          allDone = false;
        }
      }

      el.textContent = display.join('').trimEnd();

      if (allDone) {
        clearInterval(interval);
        el.textContent = word;
        resolve();
      }
    }, TICK_INTERVAL);
  });
}

export function initScramble(el: HTMLElement) {
  let currentIndex = 0;

  async function loop() {
    while (true) {
      await scrambleTo(el, WORDS[currentIndex]);
      await new Promise((r) => setTimeout(r, PAUSE_BETWEEN));
      currentIndex = (currentIndex + 1) % WORDS.length;
    }
  }

  el.textContent = WORDS[0];
  currentIndex = 1;
  setTimeout(() => loop(), PAUSE_BETWEEN);
}

const NAME = 'PATRICIO ZENKLUSSEN';
const EASTER_EGG = "YOU LIKE CLICKING, DON'T YOU?";
const CLICK_THRESHOLD = 5;
const EASTER_EGG_DURATION = 10000;

export function initNameScramble(el: HTMLElement) {
  let clickCount = 0;
  let locked = false;

  el.style.cursor = 'pointer';

  el.addEventListener('click', async () => {
    if (locked) return;

    clickCount++;

    if (clickCount >= CLICK_THRESHOLD) {
      locked = true;
      clickCount = 0;
      await scrambleTo(el, EASTER_EGG);
      await new Promise((r) => setTimeout(r, EASTER_EGG_DURATION));
      await scrambleTo(el, NAME);
      locked = false;
    } else {
      locked = true;
      await scrambleTo(el, NAME);
      locked = false;
    }
  });
}
