"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, usePageVisible, usePrefersReducedMotion } from "./MotionHooks";

const WORDMARK = "MYRAKAL";

export function WordmarkMaterial() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(hostRef, 0.05);
  const pageVisible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const mobile = window.matchMedia("(max-width: 800px)").matches;
    if (!host || !canvas || reducedMotion || mobile || !inView || !pageVisible) return;

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
      width = Math.max(1, host.clientWidth);
      height = Math.max(1, host.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      mask.width = canvas.width;
      mask.height = canvas.height;

      const style = getComputedStyle(host);
      const fontSize = Number.parseFloat(style.fontSize);
      const letterSpacing = Number.parseFloat(style.letterSpacing) || 0;
      maskContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      maskContext.clearRect(0, 0, width, height);
      maskContext.fillStyle = "#fff";
      maskContext.font = `${style.fontWeight} ${fontSize}px ${style.fontFamily}`;
      maskContext.textBaseline = "alphabetic";

      const widths = [...WORDMARK].map((letter) => maskContext.measureText(letter).width);
      const naturalWidth = widths.reduce((sum, value) => sum + value, 0) + letterSpacing * (WORDMARK.length - 1);
      const xScale = (width * 0.985) / naturalWidth;
      const metrics = maskContext.measureText(WORDMARK);
      const baseline = (height + metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;

      maskContext.save();
      maskContext.scale(xScale, 1);
      let x = 0;
      [...WORDMARK].forEach((letter, index) => {
        maskContext.fillText(letter, x, baseline);
        x += widths[index] + letterSpacing;
      });
      maskContext.restore();
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
    <span className="wordmark-material__fallback">{WORDMARK}</span>
    <canvas ref={canvasRef} className="wordmark-material__canvas" />
  </div>;
}
