"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, usePageVisible, usePrefersReducedMotion } from "./MotionHooks";

const WORDMARK = "MYRAKAL";

export function WordmarkMaterial() {
  const hostRef = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(hostRef, 0.05);
  const pageVisible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const fallback = fallbackRef.current;
    const canvas = canvasRef.current;
    const mobile = window.matchMedia("(max-width: 800px)").matches;
    if (!host || !fallback || !canvas || reducedMotion || mobile || !inView || !pageVisible) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const mask = document.createElement("canvas");
    const maskContext = mask.getContext("2d");
    if (!maskContext) return;

    let animationFrame = 0;
    let lastFrame = 0;
    let cancelled = false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    function sizeCanvas() {
      const style = getComputedStyle(fallback);
      const fontSize = Number.parseFloat(style.fontSize);
      const padding = Math.ceil(fontSize * 0.12);
      const layoutWidth = Math.max(1, host.clientWidth, fallback.scrollWidth);
      const layoutHeight = Math.max(1, host.clientHeight);
      width = layoutWidth + padding * 2;
      height = layoutHeight + padding * 2;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.left = `${-padding}px`;
      canvas.style.top = `${-padding}px`;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      mask.width = canvas.width;
      mask.height = canvas.height;

      maskContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      maskContext.clearRect(0, 0, width, height);
      maskContext.fillStyle = "#fff";
      maskContext.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
      maskContext.textBaseline = "alphabetic";

      if (!("letterSpacing" in maskContext)) {
        setReady(false);
        return;
      }
      (maskContext as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = style.letterSpacing;
      const metrics = maskContext.measureText(WORDMARK);
      const ascent = metrics.fontBoundingBoxAscent || metrics.actualBoundingBoxAscent;
      const descent = metrics.fontBoundingBoxDescent || metrics.actualBoundingBoxDescent;
      const baseline = padding + (layoutHeight - (ascent + descent)) / 2 + ascent;
      maskContext.fillText(WORDMARK, padding, baseline);
      setReady(true);
    }

    function draw(time: number) {
      animationFrame = requestAnimationFrame(draw);
      if (time - lastFrame < 80) return;
      lastFrame = time;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#f4f2ed";
      context.fillRect(0, 0, width, height);

      const phase = time * 0.00024;
      for (let line = 0; line < 18; line += 1) {
        const base = height * (0.12 + line * 0.047);
        const amplitude = height * (0.055 + (line % 4) * 0.009);
        context.beginPath();
        for (let x = -24; x <= width + 24; x += 24) {
          const y = base + Math.sin(x * 0.012 + phase + line * 0.31) * amplitude + Math.sin(x * 0.004 - phase * 0.7) * amplitude * 0.55;
          if (x === -24) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = line % 3 === 0 ? "#8d1832" : "#35030c";
        context.lineWidth = line % 3 === 0 ? 3 : 1.2;
        context.stroke();
      }

      context.globalCompositeOperation = "destination-in";
      context.drawImage(mask, 0, 0, width, height);
      context.globalCompositeOperation = "source-over";
    }

    const resizeObserver = new ResizeObserver(sizeCanvas);
    resizeObserver.observe(host);
    document.fonts.ready.then(() => {
      if (cancelled) return;
      sizeCanvas();
      animationFrame = requestAnimationFrame(draw);
    });

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [inView, pageVisible, reducedMotion]);

  return <div ref={hostRef} className={`plate-hero__wordmark wordmark-material ${ready ? "is-ready" : ""}`} aria-hidden="true">
    <span ref={fallbackRef} className="wordmark-material__fallback">{WORDMARK}</span>
    <canvas ref={canvasRef} className="wordmark-material__canvas" />
  </div>;
}
