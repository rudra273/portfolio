import { type RefObject, useEffect, useRef } from "react";

export default function DockRefraction({ dock }: { dock: RefObject<HTMLElement> }) {
  const map = useRef<SVGFEImageElement>(null);

  useEffect(() => {
    const element = dock.current;
    const image = map.current;
    if (!element || !image || !CSS.supports("backdrop-filter", "url(#dock-refraction)")) {
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    const observer = new ResizeObserver(() => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height) return;

      canvas.width = width;
      canvas.height = height;
      const pixels = context.createImageData(width, height);
      const radius = height / 2;
      const bevel = 10;

      // Red and green encode inward offsets along the capsule's curved rim.
      // The flat center stays at neutral gray so it passes the backdrop through.
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const dx = x + 0.5 - Math.max(radius, Math.min(x + 0.5, width - radius));
          const dy = y + 0.5 - radius;
          const distance = Math.hypot(dx, dy);
          const edge = Math.max(0, 1 - Math.abs(radius - distance) / bevel);
          const bend = (92 * edge ** 2) / (distance || 1);
          const pixel = (y * width + x) * 4;
          pixels.data[pixel] = 127.5 - dx * bend;
          pixels.data[pixel + 1] = 127.5 - dy * bend;
          pixels.data[pixel + 3] = 255;
        }
      }

      context.putImageData(pixels, 0, 0);
      image.setAttribute("href", canvas.toDataURL());
      element.dataset.refractive = "";
    });

    observer.observe(element);
    return () => {
      observer.disconnect();
      delete element.dataset.refractive;
    };
  }, [dock]);

  return (
    <svg className="dock-refraction" width="0" height="0" aria-hidden="true">
      <filter id="dock-refraction" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
        <feImage ref={map} preserveAspectRatio="none" result="rim" />
        <feDisplacementMap in="SourceGraphic" in2="rim" scale="28" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
