export function enablePinchZoom(element: HTMLElement, container: HTMLElement) {
  element.style.touchAction = "none";
  element.style.transformOrigin = "0 0"; // usamos origen fijo para cálculos precisos

  let startDistance = 0;
  let startScale = 1;
  let scale = 1;

  let startMidpointEl = { x: 0, y: 0 }; // punto medio en coords del elemento
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;

  const rect = element.getBoundingClientRect();
  const naturalWidth = rect.width;
  const naturalHeight = rect.height;

  element.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      // Inicio de pinch
      startDistance = getDistance(e.touches[0], e.touches[1]);
      startScale = scale;

      const mid = getMidpoint(e.touches[0], e.touches[1]);
      startMidpointEl = screenToElementCoords(mid.x, mid.y);
    } else if (e.touches.length === 1 && scale > 1) {
      // Inicio de pan
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
    }
  }, { passive: true });

  element.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      const newDistance = getDistance(e.touches[0], e.touches[1]);
      const newScale = clamp(startScale * (newDistance / startDistance), 1, 5);

      const mid = getMidpoint(e.touches[0], e.touches[1]);
      const midAfter = {
        x: startMidpointEl.x * newScale,
        y: startMidpointEl.y * newScale
      };

      const containerRect = container.getBoundingClientRect();
      translateX = mid.x - containerRect.left - midAfter.x;
      translateY = mid.y - containerRect.top - midAfter.y;

      scale = newScale;
      clampTranslation();
      applyTransform();
    } else if (e.touches.length === 1 && scale > 1) {
      // Pan
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
      clampTranslation();
      applyTransform();
    }
  }, { passive: true });

  element.addEventListener("touchend", () => {
    if (scale <= 1.01) {
      scale = 1;
      translateX = 0;
      translateY = 0;
      applyTransform();
    }
  }, { passive: true });

  function applyTransform() {
    element.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  }

  function clampTranslation() {
    const containerRect = container.getBoundingClientRect();
    const maxX = Math.max(0, (naturalWidth * scale - containerRect.width) / 2);
    const maxY = Math.max(0, (naturalHeight * scale - containerRect.height) / 2);

    translateX = clamp(translateX, -maxX, maxX);
    translateY = clamp(translateY, -maxY, maxY);
  }

  function screenToElementCoords(screenX: number, screenY: number) {
    const containerRect = container.getBoundingClientRect();
    return {
      x: (screenX - containerRect.left - translateX) / scale,
      y: (screenY - containerRect.top - translateY) / scale
    };
  }

  function getDistance(t1: Touch, t2: Touch) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.hypot(dx, dy);
  }

  function getMidpoint(t1: Touch, t2: Touch) {
    return {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2
    };
  }

  function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }
}
