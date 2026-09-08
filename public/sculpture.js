/** Seeded geometry is calculated once. Motion only transforms the cached canvas. */
export function createSculpture(canvas, { reducedMotion = false, seed = Math.random() * 4294967296 } = {}) {
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return { setPaused() {}, destroy() {} };

  let state = seed >>> 0;
  function random() {
    state = (state + 0x6D2B79F5) | 0;
    let value = Math.imul(state ^ state >>> 15, 1 | state);
    value ^= value + Math.imul(value ^ value >>> 7, 61 | value);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  }
  const shape = {
    phase: random() * Math.PI * 2,
    fold: 20 + random() * 18,
    twist: 30 + random() * 24,
    stretch: 1.08 + random() * .16,
    rotation: -.32 + random() * .36,
    spread: 1.22 + random() * .12,
    center: .52 + random() * .08,
    offset: (random() - .5) * .06,
  };
  const count = 120, samples = 96;
  const angles = Array.from({ length: samples + 1 }, (_, j) => {
    const a = j / samples * Math.PI * 2;
    return { a, sin: Math.sin(a), cos: Math.cos(a), cos2: Math.cos(a * 2) };
  });
  const curves = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const points = new Float32Array((samples + 1) * 2);
    for (let j = 0; j <= samples; j++) {
      const { a, sin, cos, cos2 } = angles[j];
      const fold = Math.sin(a * 3 + t * 2 + shape.phase) * shape.fold;
      const radius = 143 + t * 132 + fold;
      points[j * 2] = cos * radius * (.87 + .18 * sin) + Math.sin(a * 2 + t + shape.phase * .35) * shape.twist;
      points[j * 2 + 1] = sin * radius * shape.stretch + cos2 * 49 + (t - .5) * 98;
    }
    const highlight = Math.pow(Math.sin(t * Math.PI * 2.6 + shape.phase * .15), 2);
    const shade = Math.round(67 + highlight * 110);
    return { points, color: `rgba(${shade},${shade + 3},${shade},${.55 + (1 - highlight) * .14})` };
  });

  let paused = reducedMotion, destroyed = false, resizeTimer;
  let lastWidth = 0, lastHeight = 0, lastRatio = 0;
  function render() {
    if (destroyed) return;
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    if (!width || !height) return;
    // This low-contrast background does not need a full-resolution 4K texture.
    const ratio = Math.min(window.devicePixelRatio || 1, 1.25, Math.sqrt(1600000 / (width * height)));
    if (width === lastWidth && height === lastHeight && ratio === lastRatio) return;
    lastWidth = width; lastHeight = height; lastRatio = ratio;
    canvas.width = Math.max(1, Math.floor(width * ratio));
    canvas.height = Math.max(1, Math.floor(height * ratio));
    context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width * shape.center, height * (.47 + shape.offset));
    context.rotate(shape.rotation);
    const scale = Math.max(width / 820, height / 830);
    context.scale(scale * shape.spread, scale);
    const visibleCount = width <= 704 ? 80 : count;
    for (let i = 0; i < visibleCount; i++) {
      const { points, color } = curves[Math.round(i * (count - 1) / (visibleCount - 1))];
      context.beginPath();
      context.moveTo(points[0], points[1]);
      for (let j = 2; j < points.length; j += 2) context.lineTo(points[j], points[j + 1]);
      context.strokeStyle = color;
      context.lineWidth = .72;
      context.stroke();
    }
    context.restore();
  }
  function resize() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(render, 180);
  }
  function updateMotion() {
    canvas.style.animationPlayState = paused || document.hidden ? 'paused' : 'running';
  }
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', updateMotion);
  render(); updateMotion();
  return {
    setPaused(value) { if (!destroyed) { paused = value; updateMotion(); } },
    destroy() {
      destroyed = true;
      window.clearTimeout(resizeTimer);
      canvas.style.animationPlayState = 'paused';
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', updateMotion);
    },
  };
}
