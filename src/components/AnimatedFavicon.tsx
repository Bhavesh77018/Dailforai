'use client';
import { useEffect } from 'react';

/**
 * AnimatedFavicon
 * ──────────────────────────────────────────────────────────────────
 * Draws a DialforAI branded hexagon favicon on a <canvas> and
 * animates it by cycling frames at ~12 fps using setInterval.
 *
 * Animation sequence (24 frames, ~2 s loop):
 *   Phase 1 (0-8)   – colour drifts from indigo → violet → pink
 *   Phase 2 (8-16)  – outer glow pulses up then down
 *   Phase 3 (16-24) – colour drifts back, inner highlight fades
 *
 * Browser compatibility: all modern browsers (Chrome, Firefox,
 * Safari, Edge). Pauses when the tab is hidden to save CPU.
 * ──────────────────────────────────────────────────────────────────
 */

const SIZE = 64;           // canvas size in px
const TOTAL_FRAMES = 36;   // frames in one full loop
const FPS = 12;            // frames per second

/** Linear interpolation between two values */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Interpolate between two hex colours, returns [r,g,b] */
function lerpColor(
  [r1, g1, b1]: [number, number, number],
  [r2, g2, b2]: [number, number, number],
  t: number,
): [number, number, number] {
  return [Math.round(lerp(r1, r2, t)), Math.round(lerp(g1, g2, t)), Math.round(lerp(g1, g2, t) === lerp(g1, g2, t) ? lerp(b1, b2, t) : lerp(b1, b2, t))];
}

/** Draws a regular hexagon path centred at (cx,cy) with radius r */
function hexPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i - 30);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

/**
 * Renders one favicon frame onto the canvas and returns its data URL.
 * @param frame  0 … TOTAL_FRAMES-1
 */
function renderFrame(canvas: HTMLCanvasElement, frame: number): string {
  const ctx = canvas.getContext('2d')!;
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  // ── normalised progress (0→1 over the full loop, wraps) ──────
  const t = frame / TOTAL_FRAMES;                   // 0 … <1
  const ping = Math.sin(t * Math.PI * 2);           // -1 … 1
  const pingUp = (ping + 1) / 2;                    // 0 … 1  (ease up and down)

  // ── colour palette ───────────────────────────────────────────
  const indigo:  [number,number,number] = [79,  70,  229];
  const violet:  [number,number,number] = [139, 92,  246];
  const pink:    [number,number,number] = [236, 72,  153];

  // Smoothly drift: indigo → violet → pink → violet → indigo
  let fillColor: [number,number,number];
  if (pingUp < 0.5) {
    fillColor = lerpColor(indigo, pink, pingUp * 2);
  } else {
    fillColor = lerpColor(pink, indigo, (pingUp - 0.5) * 2);
  }
  const [fr, fg, fb] = fillColor;

  // ── glow intensity follows the ping ──────────────────────────
  const glowRadius = lerp(10, 28, pingUp);
  const glowAlpha  = lerp(0.30, 0.80, pingUp);
  const hexRadius  = lerp(22, 25, pingUp);    // slight size pulse

  // ── clear ────────────────────────────────────────────────────
  ctx.clearRect(0, 0, SIZE, SIZE);

  // ── outer glow (shadow trick) ─────────────────────────────────
  ctx.save();
  ctx.shadowColor  = `rgba(${fr},${fg},${fb},${glowAlpha})`;
  ctx.shadowBlur   = glowRadius;
  hexPath(ctx, cx, cy, hexRadius);
  ctx.fillStyle = `rgb(${fr},${fg},${fb})`;
  ctx.fill();
  ctx.restore();

  // ── second pass: sharper hex on top (no glow) ────────────────
  hexPath(ctx, cx, cy, hexRadius);
  const grad = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, hexRadius);
  grad.addColorStop(0, `rgba(255,255,255,0.45)`);
  grad.addColorStop(1, `rgba(${fr},${fg},${fb},1)`);
  ctx.fillStyle = grad;
  ctx.fill();

  // ── inner "AI" text ───────────────────────────────────────────
  const fontSize = Math.round(lerp(16, 18, pingUp));
  ctx.fillStyle   = 'rgba(255,255,255,0.92)';
  ctx.font        = `700 ${fontSize}px "Inter", sans-serif`;
  ctx.textAlign   = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('AI', cx, cy + 1);

  return canvas.toDataURL('image/png');
}

export default function AnimatedFavicon() {
  useEffect(() => {
    // Build an off-screen canvas once
    const canvas = document.createElement('canvas');
    canvas.width  = SIZE;
    canvas.height = SIZE;

    // Pre-render all frames up-front so the loop is smooth
    const frames: string[] = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      frames.push(renderFrame(canvas, i));
    }

    // Grab (or create) the favicon <link> element
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel  = 'icon';
      link.type = 'image/png';
      document.head.appendChild(link);
    }

    let currentFrame = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    function startAnimation() {
      intervalId = setInterval(() => {
        link!.href = frames[currentFrame];
        currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
      }, 1000 / FPS);
    }

    function stopAnimation() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    // Pause animation when tab is hidden (saves CPU / battery)
    function handleVisibility() {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    }

    document.addEventListener('visibilitychange', handleVisibility);
    startAnimation();

    return () => {
      stopAnimation();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Renders nothing to the DOM
  return null;
}
