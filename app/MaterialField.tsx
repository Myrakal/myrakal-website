"use client";

import { useEffect, useRef } from "react";
import { useInView, usePageVisible, usePrefersReducedMotion } from "./MotionHooks";

export function MaterialField({ variant }: { variant: "judgment" | "closing" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(canvasRef, 0.05);
  const pageVisible = usePageVisible();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !parent || !context) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let pointer = 0.5;
    let targetPointer = 0.5;
    let animationFrame = 0;
    let lastFrame = 0;

    function sizeCanvas() {
      width = Math.max(1, parent.clientWidth);
      height = Math.max(1, parent.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    function render(time: number) {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      pointer += (targetPointer - pointer) * 0.035;

      const phase = (variant === "closing" ? -1 : 1) * time * 0.0002;
      const lineCount = width < 800 ? 18 : 34;
      for (let line = 0; line < lineCount; line += 1) {
        const base = height * (0.09 + line * (0.82 / Math.max(1, lineCount - 1)));
        const amplitude = height * (0.055 + pointer * 0.04);
        context.beginPath();
        for (let x = -40; x <= width + 40; x += 32) {
          const y = base
            + Math.sin(x * 0.0075 + phase + line * 0.15) * amplitude
            + Math.sin(x * 0.0027 - phase * 0.62 + line * 0.08) * amplitude * 0.8;
          if (x === -40) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        const bright = line % 6 === 0;
        context.strokeStyle = bright ? "rgba(244,242,237,.72)" : "rgba(244,242,237,.22)";
        context.lineWidth = bright ? 1.4 : 0.8;
        context.stroke();
      }
    }

    function loop(time: number) {
      animationFrame = requestAnimationFrame(loop);
      if (time - lastFrame < 48) return;
      lastFrame = time;
      render(time);
    }

    function onPointerMove(event: PointerEvent) {
      const bounds = parent.getBoundingClientRect();
      targetPointer = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    }

    const resizeObserver = new ResizeObserver(() => {
      sizeCanvas();
      render(performance.now());
    });
    resizeObserver.observe(parent);
    parent.addEventListener("pointermove", onPointerMove, { passive: true });
    sizeCanvas();
    render(0);
    if (inView && pageVisible && !reducedMotion) animationFrame = requestAnimationFrame(loop);

    return () => {
      resizeObserver.disconnect();
      parent.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [inView, pageVisible, reducedMotion, variant]);

  return <canvas ref={canvasRef} className={`material-field material-field--${variant}`} aria-hidden="true" />;
}
