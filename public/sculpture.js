/** Seeded, continuous line sculpture. One composition per page load, shared by routes. */
export function createSculpture(canvas, { reducedMotion = false, seed = Math.random() * 4294967296 } = {}) {
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return { setPage() {}, setPaused() {}, destroy() {} };

  // Randomize bounded shape parameters once, never individual animation frames.
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
  const samples = 96;
  const angles = Array.from({ length: samples + 1 }, (_, j) => {
    const a = j / samples * Math.PI * 2;
    return { a, sin: Math.sin(a), cos: Math.cos(a), cos2: Math.cos(a * 2) };
  });
  const poses = { home: 0, work: .35, project: .65, research: 1, about: 1.3 };
  let width = 0, height = 0, frame = 0, previous = 0, time = 0;
  let pointerX = 0, pointerY = 0, aimX = 0, aimY = 0, pose = 0, targetPose = 0;
  let progress = 0, targetProgress = 0;
  let paused = reducedMotion, hidden = document.hidden, destroyed = false;

  function scroll() {
    if (paused) return;
    const distance = Math.max(1, (document.documentElement.scrollHeight || height) - height);
    targetProgress = Math.max(0, Math.min(1, (window.scrollY || 0) / distance));
  }
  function render() {
    context.clearRect(0, 0, width, height);
    const mobile = width <= 704;
    const count = mobile ? 80 : 120;
    const scale = Math.max(width / 820, height / 830);
    const centerX = width * (shape.center + Math.sin(progress * Math.PI) * .035);
    const centerY = height * (.47 + shape.offset - progress * .045);
    const phase = shape.phase + pose * .22 + time * .018;
    const breath = 1 + Math.sin(time * .12 + shape.phase) * .008;
    context.save();
    context.translate(centerX + pointerX * 8, centerY + pointerY * 5);
    context.rotate(shape.rotation + pose * .065 + progress * .08 + Math.sin(time * .04) * .018);
    context.scale(scale * shape.spread, scale);
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      context.beginPath();
      for (let j = 0; j <= samples; j++) {
        const { a, sin, cos, cos2 } = angles[j];
        const fold = Math.sin(a * 3 + t * 2 + phase) * shape.fold;
        const radius = (143 + t * 132 + fold) * breath;
        const px = cos * radius * (.87 + .18 * sin) + Math.sin(a * 2 + t + phase * .35) * shape.twist;
        const py = sin * radius * shape.stretch + cos2 * 49 + (t - .5) * 98;
        if (j === 0) context.moveTo(px, py); else context.lineTo(px, py);
      }
      const highlight = Math.pow(Math.sin(t * Math.PI * 2.6 + phase * .15), 2);
      const shade = Math.round(67 + highlight * 110);
      context.strokeStyle = `rgba(${shade},${shade + 3},${shade},${.55 + (1 - highlight) * .14})`;
      context.lineWidth = .72;
      context.stroke();
    }
    context.restore();
  }
  function loop(now) {
    frame = 0;
    if (destroyed || hidden || paused) return;
    // Cap drawing at 30 fps on desktop and 24 fps on small screens.
    if (now - previous >= (width <= 704 ? 41 : 32)) {
      const dt = Math.min((now - previous) / 1000, .05);
      time += dt; previous = now;
      pointerX += (aimX - pointerX) * .10; pointerY += (aimY - pointerY) * .10;
      pose += (targetPose - pose) * .055;
      progress += (targetProgress - progress) * .055;
      render();
    }
    frame = requestAnimationFrame(loop);
  }
  function start() {
    if (!frame && !hidden && !paused && !destroyed) {
      previous = performance.now();
      frame = requestAnimationFrame(loop);
    }
  }
  function resize() {
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    scroll(); render();
  }
  function move(event) {
    if (event.pointerType === 'touch' || paused) return;
    aimX = event.clientX / width - .5; aimY = event.clientY / height - .5;
  }
  function leave() { aimX = 0; aimY = 0; }
  function visibility() {
    hidden = document.hidden;
    if (hidden) { cancelAnimationFrame(frame); frame = 0; } else start();
  }
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('scroll', scroll, { passive: true });
  window.addEventListener('pointermove', move, { passive: true });
  document.documentElement.addEventListener('pointerleave', leave);
  document.addEventListener('visibilitychange', visibility);
  resize(); start();
  return {
    setPage(key) { targetPose = poses[key] ?? 0; if (paused) pose = targetPose; scroll(); render(); },
    setPaused(value) {
      paused = value;
      if (paused) { cancelAnimationFrame(frame); frame = 0; }
      else { scroll(); start(); }
    },
    destroy() {
      destroyed = true; cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility);
    },
  };
}
