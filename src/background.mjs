// Precompute the contour field during the build. The browser only displays an SVG.
export function createBackground() {
  const paths = [];
  const count = 56;
  const samples = 20;
  const point = (i, t) => {
    const angle = (i % samples) / samples * Math.PI * 2;
    const radius = 192 + t * 186 + Math.sin(angle * 3 + t * 2 + .7) * 34;
    const x = Math.cos(angle) * radius * (1 + .2 * Math.sin(angle)) + Math.sin(angle * 2 + t) * 46;
    const y = Math.sin(angle) * radius * 1.2 + Math.cos(angle * 2) * 65 + (t - .5) * 116;
    return [x, y];
  };
  const coordinate = p => p.map(n => n.toFixed(1)).join(' ');
  for (let ring = 0; ring < count; ring++) {
    const t = ring / (count - 1);
    const points = Array.from({length:samples}, (_,i) => point(i,t));
    let d = `M${coordinate(points[0])}`;
    for (let i = 0; i < samples; i++) {
      const p0 = points[(i + samples - 1) % samples];
      const p1 = points[i];
      const p2 = points[(i + 1) % samples];
      const p3 = points[(i + 2) % samples];
      const c1 = p1.map((v,j) => v + (p2[j] - p0[j]) / 6);
      const c2 = p2.map((v,j) => v - (p3[j] - p1[j]) / 6);
      d += `C${coordinate(c1)} ${coordinate(c2)} ${coordinate(p2)}`;
    }
    paths.push(`<path d="${d}Z"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1100" fill="none"><g transform="translate(1040 470) rotate(-24) scale(1.65 1.12)" stroke="#456ca5" stroke-width="1" opacity=".23">${paths.join('')}</g></svg>`;
}
