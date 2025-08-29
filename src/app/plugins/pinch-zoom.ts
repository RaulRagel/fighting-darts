export function enablePinchZoom(
  element: Element,
  container: HTMLElement,
  debug: boolean = false
) {
  (element as HTMLElement).style.touchAction = "none";
  (element as HTMLElement).style.transformOrigin = "0 0";

  let startDistance = 0;
  let startScale = 1;
  let scale = 1;

  let startMidpointEl = { x: 0, y: 0 };
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;

  let mode: "idle" | "pinching" | "panning" = "idle";

  const log = (...args: any[]) => {
    if (debug) console.log(...args);
  };

  element.addEventListener(
    "touchstart",
    (e) => {
      const event = e as TouchEvent;
      if (event.touches.length === 2) {
        mode = "pinching";
        startDistance = getDistance(event.touches[0], event.touches[1]);
        startScale = scale;

        const mid = getMidpoint(event.touches[0], event.touches[1]);
        startMidpointEl = screenToElementCoords(mid.x, mid.y);
        log("🔍 Pinch start", { startDistance, startScale, startMidpointEl });
      } else if (event.touches.length === 1 && scale > 1 && mode !== "pinching") {
        mode = "panning";
        startX = event.touches[0].clientX - translateX;
        startY = event.touches[0].clientY - translateY;
        log("🖐 Pan start", { startX, startY });
      }
    },
    { passive: true }
  );

  element.addEventListener(
    "touchmove",
    (e) => {
      const event = e as TouchEvent;
      if (event.touches.length === 2 && mode === "pinching") {
        const newDistance = getDistance(event.touches[0], event.touches[1]);
        const newScale = clamp(
          startScale * (newDistance / startDistance),
          1,
          5
        );

        const mid = getMidpoint(event.touches[0], event.touches[1]);
        const midAfter = {
          x: startMidpointEl.x * newScale,
          y: startMidpointEl.y * newScale,
        };

        const containerRect = container.getBoundingClientRect();
        translateX = mid.x - containerRect.left - midAfter.x;
        translateY = mid.y - containerRect.top - midAfter.y;

        scale = newScale;
        clampTranslation();
        applyTransform();
        log("🔍 Pinching", { scale, translateX, translateY });
      } else if (event.touches.length === 1 && mode === "panning") {
        translateX = event.touches[0].clientX - startX;
        translateY = event.touches[0].clientY - startY;
        clampTranslation();
        applyTransform();
        log("🖐 Panning", { translateX, translateY });
      }
    },
    { passive: true }
  );

  element.addEventListener(
    "touchend",
    (e) => {
      const event = e as TouchEvent;
      if (event.touches.length === 0) {
        mode = "idle";
        recenterIfNeeded();
        applyTransform();

        if (scale <= 1.01) {
          scale = 1;
          translateX = 0;
          translateY = 0;
          applyTransform();
        }

        log("✅ Gesture end", {
          translateX,
          translateY,
          scale,
        });
      }
    },
    { passive: true }
  );

  function getElementWidth() {
    if ('getBBox' in element) {
      return (element as SVGGraphicsElement).getBBox().width * scale;
    }
    return (element as HTMLElement).offsetWidth * scale;
  }

  function getElementHeight() {
    if ('getBBox' in element) {
      return (element as SVGGraphicsElement).getBBox().height * scale;
    }
    return (element as HTMLElement).offsetHeight * scale;
  }

  function applyTransform() {
    if ('getBBox' in element) {
      // Para SVG, usa el atributo transform
      (element as SVGGraphicsElement).setAttribute(
        'transform',
        `translate(${translateX},${translateY}) scale(${scale})`
      );
    } else {
      (element as HTMLElement).style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }
  }

  function clampTranslation() {
    const containerRect = container.getBoundingClientRect();
    const elemWidth = getElementWidth();
    const elemHeight = getElementHeight();

    const minX = Math.min(0, containerRect.width - elemWidth);
    const maxX = Math.max(0, containerRect.width - elemWidth);

    const minY = Math.min(0, containerRect.height - elemHeight);
    const maxY = Math.max(0, containerRect.height - elemHeight);

    log("📏 clampTranslation", {
      elemWidth,
      elemHeight,
      containerWidth: containerRect.width,
      containerHeight: containerRect.height,
      translateX_before: translateX,
      translateY_before: translateY,
      minX,
      maxX,
      minY,
      maxY
    });

    translateX = clamp(translateX, minX, maxX);
    translateY = clamp(translateY, minY, maxY);
  }


  function recenterIfNeeded() {
    const containerRect = container.getBoundingClientRect();
    const elemWidth = (element as HTMLElement).offsetWidth * scale;
    const elemHeight = (element as HTMLElement).offsetHeight * scale;

    const minX = Math.min(0, containerRect.width - elemWidth);
    const maxX = Math.max(0, containerRect.width - elemWidth);

    const minY = Math.min(0, containerRect.height - elemHeight);
    const maxY = Math.max(0, containerRect.height - elemHeight);

    if (translateX < minX) translateX = minX;
    if (translateX > maxX) translateX = maxX;
    if (translateY < minY) translateY = minY;
    if (translateY > maxY) translateY = maxY;

    log("🎯 recenterIfNeeded", { translateX, translateY, minX, maxX, minY, maxY });
  }


  function screenToElementCoords(screenX: number, screenY: number) {
    const containerRect = container.getBoundingClientRect();
    return {
      x: (screenX - containerRect.left - translateX) / scale,
      y: (screenY - containerRect.top - translateY) / scale,
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
      y: (t1.clientY + t2.clientY) / 2,
    };
  }

  function clamp(val: number, min: number, max: number) {
    return Math.min(Math.max(val, min), max);
  }
}
