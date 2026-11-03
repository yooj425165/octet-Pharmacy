// Browser chrome can reduce the visible area without resizing the layout viewport.
function updateVisibleHeight() {
  const viewport = window.visualViewport;
  // Preserve normal browser zoom rather than shrinking the interface while pinching.
  if (viewport && Math.abs(viewport.scale - 1) > 0.01) return;
  const height = viewport ? viewport.height : window.innerHeight;
  document.documentElement.style.setProperty('--visible-height', `${height}px`);
}

updateVisibleHeight();
window.addEventListener('resize', updateVisibleHeight);
window.visualViewport?.addEventListener('resize', updateVisibleHeight);
