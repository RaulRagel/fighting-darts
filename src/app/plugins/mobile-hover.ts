// mobile-hover.js
export function enableMobileHover(dartboardSections: HTMLElement[]) {
  dartboardSections.forEach(el => {
    el.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length === 1) { // Solo un dedo → hover
        el.classList.add('mobile-hover');
      }
    }, { passive: true });

    const cleanup = (e: TouchEvent) => {
      // Limpia solo si ya no hay dedos o queda solo uno
      if (e.touches.length <= 1) {
        el.classList.remove('mobile-hover');
      }
    };

    el.addEventListener('touchend', cleanup, { passive: true });
    el.addEventListener('touchcancel', cleanup, { passive: true });

    el.addEventListener('touchmove', (e: TouchEvent) => {
      if (e.touches.length === 1) {
        cleanup(e);
      }
      // Si hay más de un dedo, dejamos que el navegador maneje el pinch-zoom
    }, { passive: true });
  });
}
