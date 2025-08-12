export function enablePinchZoom(element: HTMLElement) {
  console.log('✅ pinch zoom inicializado en', element);
  element.style.touchAction = "none";
  element.style.transformOrigin = "center center";

  let startDistance = 0;
  let startScale = 1;
  let scale = 1;

  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;

  element.addEventListener("touchstart", (e) => {
    console.log("touchstart", e.touches.length);

    if (e.touches.length === 2) {
      startDistance = getDistance(e.touches[0], e.touches[1]);
      startScale = scale;
      console.log("Pinch startDistance:", startDistance, "startScale:", startScale);
    } else if (e.touches.length === 1 && scale > 1) {
      startX = e.touches[0].clientX - translateX;
      startY = e.touches[0].clientY - translateY;
      console.log("Pan startX/Y:", startX, startY);
    }
  }, { passive: true });

  element.addEventListener("touchmove", (e) => {
    console.log("touchmove", e.touches.length);

    if (e.touches.length === 2) {
      const newDistance = getDistance(e.touches[0], e.touches[1]);
      scale = clamp(startScale * (newDistance / startDistance), 1, 5);
      console.log("Pinch newDistance:", newDistance, "scale:", scale);
      applyTransform();
    } else if (e.touches.length === 1 && scale > 1) {
      translateX = e.touches[0].clientX - startX;
      translateY = e.touches[0].clientY - startY;
      console.log("Pan translateX/Y:", translateX, translateY);
      applyTransform();
    }
  }, { passive: true });

  element.addEventListener("touchend", () => {
    console.log("touchend");
    if (scale <= 1.01) {
      scale = 1;
      translateX = 0;
      translateY = 0;
      console.log("Reset zoom to 1");
      applyTransform();
    }
  }, { passive: true });

  function applyTransform() {
    element.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    console.log("Transform applied:", element.style.transform);
  }

  function getDistance(t1: Touch, t2: Touch) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.hypot(dx, dy);
  }

  function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }
}
