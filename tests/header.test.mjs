import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const code = (await readFile(new URL('../dist/header.js', import.meta.url), 'utf8'))
  .replace('export function', 'function') + '\nglobalThis.createContextualHeader = createContextualHeader;';

function setup({ visible = true, supported = true } = {}) {
  const intersections = [], resizes = [], events = new Map(), pending = [];
  const focusedLink = {};
  const identity = { offsetTop: 0, offsetHeight: 88, inert: false, attributes: {},
    contains: element => element === focusedLink,
    setAttribute(name, value) { this.attributes[name] = value; },
    addEventListener: (name, fn) => events.set(name, fn),
    removeEventListener: name => events.delete(name),
  };
  const header = { offsetHeight: 88, dataset: {}, querySelector: () => identity };
  const hero = { getBoundingClientRect: () => ({ top: visible ? 88 : -400, bottom: visible ? 400 : -20 }) };
  const document = { activeElement: null, querySelector: () => hero };
  class IntersectionObserver {
    constructor(callback, options) { this.callback = callback; this.options = options; intersections.push(this); }
    observe(target) { this.target = target; }
    disconnect() { this.disconnected = true; }
    emit(isIntersecting) { this.callback([{ target: this.target, isIntersecting, intersectionRect: { height: isIntersecting ? 100 : 0 } }]); }
  }
  class ResizeObserver {
    constructor(callback) { this.callback = callback; resizes.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  const sandbox = { document, window: { innerHeight: 900 }, queueMicrotask: fn => pending.push(fn), ResizeObserver,
    IntersectionObserver: supported ? IntersectionObserver : undefined };
  vm.createContext(sandbox); vm.runInContext(code, sandbox);
  const api = sandbox.createContextualHeader(header);
  return { api, header, identity, document, hero, focusedLink, intersections, resizes, events,
    flush() { pending.splice(0).forEach(fn => fn()); } };
}

test('Header hides redundant controls and restores their focusability after the introduction leaves view', () => {
  const site = setup();
  assert.equal(site.header.dataset.identity, 'hidden');
  assert.equal(site.identity.inert, true);
  assert.equal(site.identity.attributes['aria-hidden'], 'true');
  site.intersections[0].emit(false);
  assert.equal(site.header.dataset.identity, 'visible');
  assert.equal(site.identity.inert, false);
  assert.equal(site.identity.attributes['aria-hidden'], 'false');
  site.intersections[0].emit(true);
  assert.equal(site.header.dataset.identity, 'hidden');
  assert.deepEqual([...site.events.keys()], ['focusout']);
});

test('Navigation ignores stale visibility callbacks and honors restored scroll positions', () => {
  const site = setup();
  site.document.querySelector = () => null;
  site.api.refresh();
  assert.equal(site.header.dataset.identity, 'visible');
  site.intersections[0].emit(true);
  assert.equal(site.header.dataset.identity, 'visible');
  site.hero.getBoundingClientRect = () => ({ top: -500, bottom: -100 });
  site.document.querySelector = () => site.hero;
  site.api.refresh();
  assert.equal(site.header.dataset.identity, 'visible');
  site.intersections.at(-1).emit(true);
  assert.equal(site.header.dataset.identity, 'hidden');
});

test('A focused header link stays visible until focus leaves the tray', () => {
  const site = setup({ visible: false });
  site.document.activeElement = site.focusedLink;
  site.intersections[0].emit(true);
  assert.equal(site.header.dataset.identity, 'visible');
  assert.equal(site.identity.inert, false);
  site.document.activeElement = null;
  site.events.get('focusout')({ relatedTarget: site.focusedLink }); site.flush();
  assert.equal(site.header.dataset.identity, 'visible');
  site.events.get('focusout')({ relatedTarget: null }); site.flush();
  assert.equal(site.header.dataset.identity, 'hidden');
});

test('Responsive tray measurements update the visibility boundary only when dimensions change', () => {
  const site = setup();
  assert.equal(site.intersections[0].options.rootMargin, '-88px 0px 0px 0px');
  site.resizes[0].callback();
  assert.equal(site.intersections.length, 1);
  site.header.offsetHeight = 76; site.identity.offsetTop = 76; site.identity.offsetHeight = 56;
  site.resizes[0].callback();
  assert.equal(site.intersections.length, 2);
  assert.equal(site.intersections[0].disconnected, true);
  assert.equal(site.intersections[1].options.rootMargin, '-132px 0px 0px 0px');
  site.api.destroy();
  site.intersections[1].emit(false); site.resizes[0].callback(); site.api.refresh();
  assert.equal(site.header.dataset.identity, 'hidden');
  assert.equal(site.resizes[0].disconnected, true);
  assert.equal(site.events.size, 0);
});

test('Browsers without intersection observers retain usable header contact links', () => {
  const site = setup({ supported: false });
  assert.equal(site.header.dataset.identity, 'visible');
  assert.equal(site.identity.inert, false);
});
