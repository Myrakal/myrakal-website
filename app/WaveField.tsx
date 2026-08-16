"use client";

import { useEffect, useRef } from "react";

type WaveFieldProps = {
  className?: string;
  density?: "full" | "quiet";
  interactive?: boolean;
};

type Band = {
  base: number;
  amplitude: number;
  count: number;
  frequency: number;
  phase: number;
  spread: number;
  palette: string[];
};

const bands: Band[] = [
  { base: .69, amplitude: .105, count: 28, frequency: 1.2, phase: .2, spread: .008, palette: ["#f7f3ea", "#efe6d6", "#7e1431"] },
  { base: .58, amplitude: .16, count: 34, frequency: .78, phase: 2.35, spread: .007, palette: ["#8e2440", "#650b22", "#39030f"] },
  { base: .88, amplitude: .13, count: 22, frequency: 1.45, phase: 4.1, spread: .009, palette: ["#f7f3ea", "#b3ada4", "#240208"] },
];

export function WaveField({ className = "", density = "full", interactive = false }: WaveFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    let pulseCenter = .5;
    let pulseStrength = 0;
    let lastInteraction = -Infinity;
    let previousFrame = started;
    let reducedTimer = 0;
    let frame = 0;

    const host = canvas.parentElement;
    const activate = (clientX?: number) => {
      if (typeof clientX === "number") {
        const bounds = canvas.getBoundingClientRect();
        pulseCenter = Math.max(0, Math.min(1, (clientX - bounds.left) / Math.max(1, bounds.width)));
      }
      lastInteraction = performance.now();
      if (reduced) {
        pulseStrength = 1;
        draw(lastInteraction);
        window.clearTimeout(reducedTimer);
        reducedTimer = window.setTimeout(() => {
          lastInteraction = -Infinity;
          pulseStrength = 0;
          draw(performance.now());
        }, 240);
      }
    };
    const onPointer = (event: PointerEvent) => activate(event.clientX);
    const onFocus = () => { pulseCenter = .5; activate(); };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      pulseCenter = Math.max(0, Math.min(1, pulseCenter + (event.key === "ArrowLeft" ? -.1 : .1)));
      activate();
    };

    if (interactive && host) {
      host.addEventListener("pointermove", onPointer);
      host.addEventListener("pointerdown", onPointer);
      host.addEventListener("focus", onFocus);
      host.addEventListener("keydown", onKey);
    }

    function draw(now: number) {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      const width = Math.max(1, Math.round(canvas.clientWidth * ratio));
      const height = Math.max(1, Math.round(canvas.clientHeight * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const w = width / ratio;
      const h = height / ratio;
      context.clearRect(0, 0, w, h);
      context.lineCap = "round";
      context.lineJoin = "round";

      const t = reduced ? 2.8 : (now - started) / 1000;
      const targetStrength = now - lastInteraction < 900 ? 1 : 0;
      const elapsed = Math.min(50, Math.max(0, now - previousFrame));
      previousFrame = now;
      const easing = reduced ? 1 : 1 - Math.exp(-elapsed / 200);
      pulseStrength += (targetStrength - pulseStrength) * easing;
      const visibleBands = density === "quiet" ? bands.slice(0, 2) : bands;

      visibleBands.forEach((band, bandIndex) => {
        for (let line = 0; line < band.count; line += 1) {
          const centered = line - (band.count - 1) / 2;
          const colorAt = line / Math.max(1, band.count - 1);
          const colorIndex = Math.min(band.palette.length - 1, Math.floor(colorAt * band.palette.length));
          context.beginPath();

          for (let x = -12; x <= w + 12; x += 7) {
            const nx = x / Math.max(1, w);
            const radius = Math.max(.06, 180 / Math.max(1, w));
            const localPulse = Math.exp(-Math.pow((nx - pulseCenter) / radius, 2) * .5) * pulseStrength;
            const primary = Math.sin(nx * Math.PI * 2 * band.frequency + band.phase + t * (.22 + bandIndex * .035));
            const secondary = Math.sin(nx * Math.PI * (3.1 + bandIndex * .5) - t * .14 + centered * .027);
            const swell = 1 + Math.sin(nx * Math.PI * 2 - t * .11 + bandIndex) * .14 + localPulse * .6;
            const y = h * (band.base + primary * band.amplitude * swell + secondary * band.amplitude * .18 + centered * band.spread);
            if (x === -12) context.moveTo(x, y);
            else context.lineTo(x, y);
          }

          context.strokeStyle = band.palette[colorIndex];
          context.globalAlpha = .24 + colorAt * .7;
          context.lineWidth = bandIndex === 0 && line < 3 ? 1.8 : 1.05;
          context.stroke();
        }
      });

      context.globalAlpha = 1;
      if (!reduced) frame = requestAnimationFrame(draw);
    }

    draw(started);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(reducedTimer);
      if (interactive && host) {
        host.removeEventListener("pointermove", onPointer);
        host.removeEventListener("pointerdown", onPointer);
        host.removeEventListener("focus", onFocus);
        host.removeEventListener("keydown", onKey);
      }
    };
  }, [density, interactive]);

  return <canvas ref={canvasRef} className={`wave-field ${className}`.trim()} aria-hidden="true" />;
}
