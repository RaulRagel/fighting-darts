// evita saltos al hacer zoom pero no funciona
// debugear con chrome inspect

/*
import { enablePinchZoom } from 'src/app/plugins/pinch-zoom';

ngAfterViewInit() {
  enablePinchZoom('.board');
}

.board {
  touch-action: none;
  transform-origin: 0 0;
  will-change: transform;
}
*/

export function enablePinchZoom(containerSelector: string) {
  const el = document.querySelector(containerSelector) as HTMLElement | null;
    if (!el) return; // No se encontró el contenedor

  let scale = 1;
  let lastScale = 1;
  let startDistance = 0;

  let originX = 0;
  let originY = 0;
  let translateX = 0;
  let translateY = 0;
  let lastTranslateX = 0;
  let lastTranslateY = 0;

  function getDistance(touches: any) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  }

  function getMidpoint(touches: any) {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  }

  el.addEventListener("touchstart", e => {
    if (e.touches.length === 2) {
      e.preventDefault();

      startDistance = getDistance(e.touches);
      const mid = getMidpoint(e.touches);

      // Guardar punto de origen
      originX = mid.x - lastTranslateX;
      originY = mid.y - lastTranslateY;
    }
  }, { passive: false });

  el.addEventListener("touchmove", e => {
    if (e.touches.length === 2) {
      e.preventDefault();

      const newDistance = getDistance(e.touches);
      const mid = getMidpoint(e.touches);

      scale = (newDistance / startDistance) * lastScale;

      // Compensar el movimiento para que el centro del pinch quede fijo
      translateX = mid.x - originX * scale;
      translateY = mid.y - originY * scale;

      el.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
  }, { passive: false });

  el.addEventListener("touchend", e => {
    if (e.touches.length < 2) {
      // Guardar última escala y desplazamiento
      lastScale = scale;
      lastTranslateX = translateX;
      lastTranslateY = translateY;
    }
  });
}
