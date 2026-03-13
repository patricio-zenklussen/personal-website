function decodeEmail() {
  const chars = [112, 122, 101, 110, 107, 108, 117, 115, 115, 101, 110, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109];
  return chars.map((n) => String.fromCharCode(n)).join('');
}

export function initContact(panelEl: HTMLElement) {
  const address = decodeEmail();
  const emailText = panelEl.querySelector<HTMLElement>('[data-contact-email-text]');
  const copyBtn = panelEl.querySelector<HTMLButtonElement>('[data-contact-copy]');

  if (emailText) {
    emailText.textContent = address.replace('@', '[at]').replace('.', '[dot]');
  }

  if (!copyBtn) return;
  copyBtn.addEventListener('click', async () => {
    if (!navigator.clipboard) {
      copyBtn.textContent = 'COPY UNAVAILABLE';
      setTimeout(() => {
        copyBtn.textContent = 'COPY EMAIL';
      }, 1200);
      return;
    }
    try {
      await navigator.clipboard.writeText(address);
      copyBtn.textContent = 'COPIED';
      setTimeout(() => {
        copyBtn.textContent = 'COPY EMAIL';
      }, 1200);
    } catch {
      copyBtn.textContent = 'COPY FAILED';
      setTimeout(() => {
        copyBtn.textContent = 'COPY EMAIL';
      }, 1200);
    }
  });
}
