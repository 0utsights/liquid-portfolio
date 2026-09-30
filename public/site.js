// Progressive enhancement only: every page is complete without this file.
// 1. A WebGL contour field that reacts to the cursor, scroll, and clicks, then stops rendering when idle.
// 2. Cursor-following spotlights on cards. 3. Reveal-on-scroll for sections.

const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(pointer: fine)');

const VERT = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

// Simplex noise: Ian McEwan, Ashima Arts (MIT License), github.com/ashima/webgl-noise.
const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;       // canvas pixels
uniform float uScale;    // canvas pixels per CSS pixel
uniform float uTime;     // seconds of active animation
uniform vec2 uPointer;   // CSS pixels, origin top-left
uniform vec2 uVelocity;  // CSS pixels per frame, smoothed
uniform float uPresence; // 0..1 cursor influence
uniform float uScroll;   // CSS pixels
uniform float uIntro;    // 0..1 terrain rise on load
uniform float uFocus;    // 1 near the top of the page, lower further down
uniform vec4 uRipples[4];// x, y (CSS px), start time, strength
out vec4 color;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 css = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uScale;
  vec2 view = uRes / uScale;
  vec2 d = css - uPointer;
  float r2 = dot(d, d);
  // Cursor influence is strongest in the hero and softens once the reader is into the content.
  float calm = mix(0.45, 1.0, uFocus);
  float near = exp(-r2 / (2.0 * 150.0 * 150.0)) * uPresence * calm;
  float halo = exp(-r2 / (2.0 * 280.0 * 280.0)) * uPresence * calm;

  // Terrain: a slowly drifting, domain-warped noise field. The cursor drags it and raises a hill.
  vec2 world = css + vec2(0.0, uScroll * 0.45) - uVelocity * halo * 5.0;
  vec2 q = world * 0.00105;
  float t = uTime * 0.035;
  vec2 warp = vec2(snoise(q * 0.8 + vec2(t, 1.7)), snoise(q * 0.8 + vec2(4.3, -t)));
  float h = snoise(q + warp * 0.55) * 0.62 + snoise(q * 2.2 - warp * 0.35 + 9.1) * 0.24;
  h *= uIntro;
  h += near * 0.5;

  for (int i = 0; i < 4; i++) {
    vec4 rp = uRipples[i];
    float age = uTime - rp.z;
    if (rp.w > 0.0 && age > 0.0 && age < 3.2) {
      float dist = length(css - rp.xy) - age * 460.0;
      h += sin(dist * 0.045) * exp(-dist * dist / 5200.0) * 0.16 * rp.w * (1.0 - age / 3.2);
    }
  }

  // Contour lines: about one canvas pixel wide at any resolution; every fifth line is an index line.
  float v = h * 11.0;
  float band = abs(fract(v) - 0.5);
  float fw = max(fwidth(v), 1e-4);
  // Fade lines packed tighter than about two pixels apart, which would otherwise alias into speckle.
  float line = (1.0 - smoothstep(0.45, 1.35, band / fw)) * (1.0 - smoothstep(0.3, 0.6, fw));
  float index = step(mod(floor(v + 0.5), 5.0), 0.5);

  vec2 uv = css / view;
  // Quiet by default: faint behind the text column, nearly gone once the reader scrolls into content.
  float side = mix(0.3, 1.0, smoothstep(0.2, 0.85, uv.x));
  float fade = mix(0.28, 1.0, uFocus) * (1.0 - 0.45 * smoothstep(0.5, 1.1, uv.y));
  float alpha = line * (0.06 + 0.06 * index) * side * fade + line * near * 0.3 + line * halo * 0.05;

  vec3 bg = vec3(0.024, 0.039, 0.075);
  vec3 ink = mix(vec3(0.33, 0.45, 0.76), vec3(0.56, 0.68, 0.95), clamp(near * 1.4, 0.0, 1.0));
  vec3 col = bg + ink * alpha + vec3(0.07, 0.11, 0.24) * halo * 0.1;
  col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  color = vec4(col, 1.0);
}`;

function startField() {
  const host = document.querySelector('.field');
  if (!host) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'field-canvas';
  const gl = canvas.getContext('webgl2', {alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power'});
  const fail = () => { root.classList.add('no-webgl'); canvas.remove(); };
  if (!gl) return fail();

  const shader = (type, source) => { const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s); return s; };
  const program = gl.createProgram();
  gl.attachShader(program, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return fail();
  gl.useProgram(program);
  const u = {};
  for (const name of ['uRes', 'uScale', 'uTime', 'uPointer', 'uVelocity', 'uPresence', 'uScroll', 'uIntro', 'uFocus', 'uRipples']) u[name] = gl.getUniformLocation(program, name);
  host.append(canvas);

  const still = reducedMotion.matches;
  // Canvas pixels per CSS pixel; lowered automatically if frames run long.
  let quality = finePointer.matches ? 0.75 : 0.55;
  let scale = 1;
  const s = {
    time: 0, intro: still ? 1 : 0,
    x: innerWidth * 0.72, y: innerHeight * 0.4, tx: innerWidth * 0.72, ty: innerHeight * 0.4,
    vx: 0, vy: 0, presence: 0, pointerAt: -1e9, activeAt: performance.now(),
    ripples: new Float32Array(16), next: 0,
  };

  function resize() {
    scale = Math.min(devicePixelRatio || 1, 2) * quality;
    const w = Math.max(1, Math.round(canvas.clientWidth * scale));
    const h = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  }

  function draw() {
    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    gl.uniform1f(u.uScale, canvas.width / canvas.clientWidth);
    gl.uniform1f(u.uTime, s.time);
    gl.uniform2f(u.uPointer, s.x, s.y);
    gl.uniform2f(u.uVelocity, s.vx, s.vy);
    gl.uniform1f(u.uPresence, s.presence);
    gl.uniform1f(u.uScroll, scrollY);
    gl.uniform1f(u.uIntro, 1 - Math.pow(1 - s.intro, 3));
    gl.uniform1f(u.uFocus, Math.max(0, 1 - scrollY / (innerHeight * 1.1)));
    gl.uniform4fv(u.uRipples, s.ripples);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  let running = false, last = 0, slow = 0, frames = 0;
  function frame(now) {
    const dt = Math.min(now - last, 64) / 1000;
    last = now;
    s.time += dt;
    s.intro = Math.min(1, s.intro + dt / 1.8);
    const follow = 1 - Math.exp(-dt * 9);
    const px = s.x, py = s.y;
    s.x += (s.tx - s.x) * follow;
    s.y += (s.ty - s.y) * follow;
    const settle = 1 - Math.exp(-dt * 6);
    s.vx += ((s.x - px) - s.vx) * settle;
    s.vy += ((s.y - py) - s.vy) * settle;
    const wanted = now - s.pointerAt < 1200 ? 1 : 0;
    s.presence += (wanted - s.presence) * (1 - Math.exp(-dt * (wanted ? 5 : 2.4)));
    draw();

    // Adaptive resolution: sustained long frames lower the internal resolution (never the frame rate).
    frames++;
    slow = dt > 0.021 ? slow + 1 : Math.max(0, slow - 1);
    if (slow > 18 && quality > 0.36) { quality *= 0.8; slow = 0; resize(); }

    const ripplesActive = [0, 1, 2, 3].some(i => s.ripples[i * 4 + 3] > 0 && s.time - s.ripples[i * 4 + 2] < 3.2);
    const idle = s.intro >= 1 && !ripplesActive && s.presence < 0.004 && Math.hypot(s.vx, s.vy) < 0.02 && now - s.activeAt > 1500;
    if (idle) { running = false; return; }
    requestAnimationFrame(frame);
  }
  function wake() {
    s.activeAt = performance.now();
    if (still) { draw(); return; }
    if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
  }

  resize();
  draw();
  requestAnimationFrame(() => canvas.classList.add('is-ready'));
  wake();

  new ResizeObserver(() => { resize(); draw(); }).observe(canvas);
  addEventListener('scroll', wake, {passive: true});
  if (!still) {
    addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      s.tx = e.clientX; s.ty = e.clientY; s.pointerAt = performance.now(); wake();
    }, {passive: true});
    root.addEventListener('pointerleave', () => { s.pointerAt = -1e9; wake(); });
    addEventListener('pointerdown', e => {
      const i = s.next++ % 4;
      s.ripples.set([e.clientX, e.clientY, s.time, e.pointerType === 'mouse' ? 1 : 0.8], i * 4);
      wake();
    }, {passive: true});
  }
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); running = true; fail(); });
}

function startSpotlights() {
  if (!finePointer.matches) return;
  addEventListener('pointermove', e => {
    const card = e.target instanceof Element && e.target.closest('.card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, {passive: true});
}

function startReveals() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reducedMotion.matches) { items.forEach(el => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
  }, {rootMargin: '0px 0px -6% 0px'});
  items.forEach(el => io.observe(el));
  // Anything already above the fold (or jumped to via a hash link) shows immediately.
  requestAnimationFrame(() => items.forEach(el => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-in'); }));
}

startReveals();
startSpotlights();
try { startField(); } catch { root.classList.add('no-webgl'); }
