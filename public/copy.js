// Copy buttons next to the email, GitHub, and LinkedIn links. The buttons are hidden in the HTML and
// only appear when this script runs; the links work on their own either way.
const status = document.getElementById('copy-status');

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers or blocked clipboard permission: fall back to a temporary selection.
    const field = Object.assign(document.createElement('textarea'), {value: text, readOnly: true});
    field.style.cssText = 'position:fixed;opacity:0';
    document.body.append(field);
    field.select();
    const ok = document.execCommand('copy');
    field.remove();
    return ok;
  }
}

for (const button of document.querySelectorAll('button[data-copy]')) {
  button.hidden = false;
  let timer;
  button.addEventListener('click', async () => {
    const ok = await copy(button.dataset.copy);
    const what = button.getAttribute('aria-label').replace(/^Copy /, '');
    button.dataset.state = ok ? 'copied' : 'failed';
    status.textContent = ok ? `Copied ${what}: ${button.dataset.copy}` : `Could not copy the ${what}`;
    clearTimeout(timer);
    timer = setTimeout(() => { delete button.dataset.state; status.textContent = ''; }, 1800);
  });
}
