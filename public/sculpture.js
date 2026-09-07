/** Continuous line sculpture. No textures, downloads, WebGL, or render framework. */
export function createSculpture(canvas, { reducedMotion = false } = {}) {
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return { setPage() {}, setPaused() {}, destroy() {} };
  const count = 136, samples = 110;
  const angles = Array.from({ length: samples + 1 }, (_, j) => {
    const a = j / samples * Math.PI * 2;
    return { a, sin: Math.sin(a), cos: Math.cos(a), sin2: Math.sin(a * 2), cos2: Math.cos(a * 2) };
  });
  const poses = { home: 0, work: .7, project: 1.1, research: 1.7, about: 2.4 };
  let width = 0, height = 0, frame = 0, previous = 0, time = 0;
  let pointerX = 0, pointerY = 0, aimX = 0, aimY = 0, pose = 0, targetPose = 0;
  let paused = reducedMotion, hidden = document.hidden, destroyed = false;

  function render() {
    context.clearRect(0, 0, width, height);
    const mobile = width <= 704;
    const scale = mobile ? Math.min(height / 740, .13) : Math.min(width / 1900, height / 780, .8);
    const centerX = mobile ? width * .85 : width * .80;
    const centerY = height * .46;
    const breath = Math.sin(time * .16) * .012;
    context.save();
    context.translate(centerX + pointerX * 13, centerY + pointerY * 9);
    context.rotate(-.24 + pose * .13 + Math.sin(time * .055) * .025);
    context.scale(scale, scale);
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      context.beginPath();
      for (let j = 0; j <= samples; j++) {
        const { a, sin, cos, sin2, cos2 } = angles[j];
        const fold = Math.sin(a * 3 + t * 2 + pose * .45) * 30;
        const radius = (143 + t * 132 + fold) * (1 + breath);
        const px = cos * radius * (.87 + .18 * sin) + Math.sin(a * 2 + t + pose * .28) * 42;
        const py = sin * radius * 1.19 + cos2 * 49 + (t - .5) * 98;
        if (j === 0) context.moveTo(px, py); else context.lineTo(px, py);
      }
      const highlight = Math.pow(Math.sin(t * Math.PI * 2.6 + pose * .2), 2);
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
    // At most 30 draws per second; interaction and page transitions stay independent.
    if (now - previous >= 32) {
      const dt = Math.min((now - previous) / 1000, .05);
      time += dt; previous = now;
      pointerX += (aimX - pointerX) * .12; pointerY += (aimY - pointerY) * .12;
      pose += (targetPose - pose) * .075;
      render();
    }
    frame = requestAnimationFrame(loop);
  }
  function start() { if (!frame && !hidden && !paused && !destroyed) frame = requestAnimationFrame(loop); }
  function resize() {
    width = canvas.clientWidth || window.innerWidth;
    height = canvas.clientHeight || window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);render();
  }
  function move(event) {
    if (event.pointerType === 'touch' || paused) return;
    aimX = event.clientX / width - .5; aimY = event.clientY / height - .5;
  }
  function leave() { aimX = 0; aimY = 0; }
  function visibility() {
    hidden = document.hidden;
    if (hidden) { cancelAnimationFrame(frame); frame = 0; } else { previous = performance.now(); start(); }
  }
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', move, { passive: true });
  document.documentElement.addEventListener('pointerleave', leave);
  document.addEventListener('visibilitychange', visibility);
  resize(); start();
  return {
    setPage(key) { targetPose = poses[key] ?? 0; if (paused) pose = targetPose; resize(); },
    setPaused(value) { paused = value; if (paused) { cancelAnimationFrame(frame); frame = 0; pose = targetPose; render(); } else start(); },
    destroy() { destroyed = true; cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave); document.removeEventListener('visibilitychange', visibility); },
  };
}
