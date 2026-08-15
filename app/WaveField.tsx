"use client";

import { useEffect, useRef } from "react";

type WaveFieldProps = {
  className?: string;
  density?: "full" | "quiet";
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
  { base: .69, amplitude: .105, count: 28, frequency: 1.2, phase: .2, spread: .008, palette: ["#f4eee5", "#f4eee5", "#9d0827"] },
  { base: .58, amplitude: .16, count: 34, frequency: .78, phase: 2.35, spread: .007, palette: ["#d20b3f", "#9d0827", "#4a0617"] },
  { base: .88, amplitude: .13, count: 22, frequency: 1.45, phase: 4.1, spread: .009, palette: ["#f4eee5", "#8e6c67", "#3a0712"] },
];

export function WaveField({ className = "", density = "full" }: WaveFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    let frame = 0;

    const draw = (now: number) => {
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
      const visibleBands = density === "quiet" ? bands.slice(0, 2) : bands;

      visibleBands.forEach((band, bandIndex) => {
        for (let line = 0; line < band.count; line += 1) {
          const centered = line - (band.count - 1) / 2;
          const colorAt = line / Math.max(1, band.count - 1);
          const colorIndex = Math.min(band.palette.length - 1, Math.floor(colorAt * band.palette.length));
          context.beginPath();

          for (let x = -12; x <= w + 12; x += 7) {
            const nx = x / Math.max(1, w);
            const primary = Math.sin(nx * Math.PI * 2 * band.frequency + band.phase + t * (.22 + bandIndex * .035));
            const secondary = Math.sin(nx * Math.PI * (3.1 + bandIndex * .5) - t * .14 + centered * .027);
            const swell = 1 + Math.sin(nx * Math.PI * 2 - t * .11 + bandIndex) * .14;
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
    };

    draw(started);
    return () => cancelAnimationFrame(frame);
  }, [density]);

  return <canvas ref={canvasRef} className={`wave-field ${className}`.trim()} aria-hidden="true" />;
}
