// mobile-hover.js
export function enableMobileHover(dartboardSections: Element[]) {
  dartboardSections.forEach(el => {
    el.addEventListener('touchstart', (e: Event) => {
      const event = e as TouchEvent;
      if (event.touches.length === 1) {
        el.classList.add('mobile-hover');
      }
    }, { passive: true });

    const cleanup = (e: Event) => {
      const event = e as TouchEvent;
      if (event.touches.length <= 1) {
        el.classList.remove('mobile-hover');
      }
    };

    el.addEventListener('touchend', cleanup, { passive: true });
    el.addEventListener('touchcancel', cleanup, { passive: true });

    el.addEventListener('touchmove', (e: Event) => {
      const event = e as TouchEvent;
      if (event.touches.length === 1) {
        cleanup(e);
      }
    }, { passive: true });
  });
}
