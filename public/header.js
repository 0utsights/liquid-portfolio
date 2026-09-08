// Observe the introduction boundary instead of measuring on every scroll event.
// The identity tray occupies a fixed layer, so revealing it never moves content.
export function createContextualHeader(header) {
  const identity = header.querySelector('.header-identity');
  let observer, source, sourceVisible = false, inset = -1, destroyed = false;

  function apply() {
    if (destroyed) return;
    // Keep a focused contact link available until the user moves focus away.
    const hide = sourceVisible && !identity.contains(document.activeElement);
    identity.inert = hide;
    identity.setAttribute('aria-hidden', String(hide));
    header.dataset.identity = hide ? 'hidden' : 'visible';
  }

  function observeSource() {
    observer?.disconnect();
    observer = null;
    source = document.querySelector('[data-header-source]');
    if (!source || typeof IntersectionObserver === 'undefined') {
      sourceVisible = false;
      apply();
      return;
    }
    const currentSource = source;
    const rect = source.getBoundingClientRect();
    sourceVisible = rect.bottom > inset && rect.top < window.innerHeight;
    apply();
    const currentObserver = new IntersectionObserver(entries => {
      if (destroyed || observer !== currentObserver) return;
      const entry = entries.find(item => item.target === currentSource);
      if (!entry) return;
      sourceVisible = entry.isIntersecting && entry.intersectionRect.height > 0;
      apply();
    }, { rootMargin: `-${inset}px 0px 0px 0px`, threshold: 0 });
    observer = currentObserver;
    observer.observe(currentSource);
  }

  function measureInset() {
    // offset measurements are unaffected by the tray's transition transform.
    return Math.ceil(Math.max(header.offsetHeight, identity.offsetTop + identity.offsetHeight));
  }

  function refresh() {
    if (destroyed) return;
    inset = measureInset();
    observeSource();
  }

  const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => {
    if (!destroyed && measureInset() !== inset) refresh();
  });
  resizeObserver?.observe(header);
  resizeObserver?.observe(identity);
  const onFocusOut = event => {
    // A blur microtask can run before focus reaches the next link in the tray.
    if (!identity.contains(event.relatedTarget)) queueMicrotask(apply);
  };
  identity.addEventListener('focusout', onFocusOut);
  refresh();

  return {
    refresh,
    destroy() {
      destroyed = true;
      observer?.disconnect();
      resizeObserver?.disconnect();
      identity.removeEventListener('focusout', onFocusOut);
    },
  };
}
