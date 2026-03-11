export function initContact(el: HTMLElement) {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const c = [112,122,101,110,107,108,117,115,115,101,110,64,103,109,97,105,108,46,99,111,109];
    const addr = c.map((n) => String.fromCharCode(n)).join('');
    window.location.href = ['m','a','i','l','t','o',':'].join('') + addr;
  });
}
