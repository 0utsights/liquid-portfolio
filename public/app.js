import { createSculpture } from './sculpture.js';

const root = document.documentElement;
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
// Keep the default light on touch devices and data-saving connections.
let motionPaused = motionPreference.matches || matchMedia('(pointer: coarse)').matches || navigator.connection?.saveData === true;
try {
  const savedMotion = localStorage.getItem('portfolio-motion');
  if (!motionPreference.matches && savedMotion === 'playing') motionPaused = false;
  if (savedMotion === 'paused') motionPaused = true;
} catch { /* Private browsing may disable storage. */ }
const sculpture = createSculpture(document.getElementById('sculpture'), { reducedMotion: motionPaused });
const motionButton = document.getElementById('motion-toggle');
const soundButton = document.getElementById('sound-toggle');
document.querySelector('.preferences').hidden = false;

function updateMotion() {
  root.dataset.motion = motionPaused ? 'paused' : 'playing';
  motionButton.textContent = motionPaused ? 'Resume motion' : 'Pause motion';
  motionButton.setAttribute('aria-pressed', String(motionPaused));
  sculpture.setPaused(motionPaused);
}
motionButton.addEventListener('click', () => {
  motionPaused = !motionPaused;
  try { localStorage.setItem('portfolio-motion', motionPaused ? 'paused' : 'playing'); } catch { /* Optional preference. */ }
  updateMotion();
});
motionPreference.addEventListener('change', event => { motionPaused = event.matches; updateMotion(); });
updateMotion();

// Original, short selection tones. Sound always requires an explicit gesture.
let audioContext, soundEnabled = false;
function tone() {
  if (!soundEnabled || !audioContext || document.hidden) return;
  const t = audioContext.currentTime;
  [523.25, 783.99].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain();
    oscillator.type = 'sine'; oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(.023, t + .015 + index * .025);
    gain.gain.exponentialRampToValueAtTime(.0001, t + .35);
    oscillator.connect(gain); gain.connect(audioContext.destination); oscillator.start(t); oscillator.stop(t + .4);
  });
}
soundButton.addEventListener('click', async () => {
  try {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.resume(); soundEnabled = !soundEnabled;
    soundButton.textContent = soundEnabled ? 'Sound on' : 'Sound off';
    soundButton.setAttribute('aria-pressed', String(soundEnabled));
    tone();
  } catch { soundButton.textContent = 'Sound unavailable'; soundButton.disabled = true; }
});
document.addEventListener('visibilitychange', () => {
  if (!audioContext) return;
  if (document.hidden) audioContext.suspend().catch(() => {});
  else if (soundEnabled) audioContext.resume().catch(() => {});
});

// Every destination is a real pre-rendered page. This enhancement preserves the
// environment between pages; a failed request falls back to ordinary navigation.
const cache = new Map();
const activeAnimations = new Set();
let navigationId = 0;
const reduced = () => motionPaused || motionPreference.matches;
function internalPage(anchor) {
  if (!anchor || anchor.target || anchor.hasAttribute('download')) return null;
  const url = new URL(anchor.href, location.href);
  if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol)) return null;
  if (!url.pathname.endsWith('/') || url.pathname === '/personal/') return null;
  return url;
}
async function fetchPage(url) {
  const key = url.pathname;
  if (!cache.has(key)) cache.set(key, fetch(key).then(response => {
    if (!response.ok) throw new Error('Page unavailable'); return response.text();
  }).catch(error => { cache.delete(key); throw error; }));
  return cache.get(key);
}
function scrollTarget(url, savedPosition) {
  if (savedPosition) { window.scrollTo({ left: savedPosition.x, top: savedPosition.y, behavior: 'instant' }); return; }
  if (url.hash) {
    let id; try { id = decodeURIComponent(url.hash.slice(1)); } catch { id = url.hash.slice(1); }
    const target = document.getElementById(id);
    if (target) { target.scrollIntoView({ behavior: 'instant' }); return; }
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
}
function savePosition() {
  history.replaceState({ ...history.state, position: { x: scrollX, y: scrollY } }, '', location.href);
}
async function navigate(url, { pop = false, position = null } = {}) {
  const id = ++navigationId;
  try {
    const html = await fetchPage(url);
    if (id !== navigationId) return;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const nextMain = doc.getElementById('main');
    if (!nextMain || !doc.documentElement.dataset.page) throw new Error('Invalid page');
    if (!pop) { savePosition(); history.pushState({}, '', url.pathname + url.search + url.hash); }
    activeAnimations.forEach(animation => animation.cancel()); activeAnimations.clear();
    const main = document.getElementById('main');
    main.replaceChildren(...nextMain.childNodes);
    document.title = doc.title;
    for (const selector of ['meta[name="description"]', 'link[rel="canonical"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:url"]']) {
      const source = doc.querySelector(selector), target = document.querySelector(selector);
      if (source && target) { const attr = source.tagName === 'LINK' ? 'href' : 'content'; target.setAttribute(attr, source.getAttribute(attr)); }
    }
    root.dataset.page = doc.documentElement.dataset.page;
    const active = root.dataset.page === 'project' ? 'work' : root.dataset.page;
    const paths = { home:'/', work:'/work/', research:'/research/', about:'/about/' };
    document.querySelectorAll('.main-nav a').forEach(link => {
      if (link.getAttribute('href') === paths[active]) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
    });
    main.focus({ preventScroll: true }); scrollTarget(url, position);
    if (!reduced()) {
      const animation = main.animate([{ opacity: .1, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 340, easing: 'cubic-bezier(.2,.8,.2,1)' });
      activeAnimations.add(animation); animation.finished.catch(()=>{}).finally(()=>activeAnimations.delete(animation));
    }
    if (!pop) tone();
  } catch { if (id === navigationId) location.assign(url.href); }
}
document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = event.target.closest('a'); const url = internalPage(anchor);
  if (!url) return;
  if (url.pathname === location.pathname) return;
  event.preventDefault(); navigate(url);
});
document.addEventListener('pointerover', event => {
  if (navigator.connection?.saveData) return;
  const url = internalPage(event.target.closest('a'));
  if (url && url.pathname !== location.pathname) fetchPage(url).catch(()=>{});
}, { passive:true });
document.addEventListener('focusin', event => {
  const url = internalPage(event.target.closest('a'));
  if (url && url.pathname !== location.pathname && !navigator.connection?.saveData) fetchPage(url).catch(()=>{});
});
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
let scrollTimer;
window.addEventListener('scroll', () => { clearTimeout(scrollTimer); scrollTimer = setTimeout(savePosition, 150); }, { passive:true });
window.addEventListener('popstate', event => { clearTimeout(scrollTimer); navigate(new URL(location.href), { pop:true, position:event.state?.position }); });
window.addEventListener('pagehide', () => { savePosition(); });
