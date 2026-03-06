import React from 'react';
import { useEffect, useRef } from 'react';
import { ReactNode } from 'react';
import { useComputedColorScheme } from '@mantine/core';

interface Color {
  r: number;
  g: number;
  b: number;
}

interface Props {
  children?: ReactNode;
}

const COLORS: Color[] = [
  { r: 0, g: 191, b: 255 },
  { r: 255, g: 105, b: 180 },
  { r: 255, g: 165, b: 0 },
  { r: 0, g: 255, b: 255 },
  { r: 255, g: 255, b: 0 },
  { r: 0, g: 255, b: 0 },
  { r: 255, g: 20, b: 147 },
  { r: 138, g: 43, b: 226 },
  { r: 255, g: 99, b: 71 },
  { r: 255, g: 218, b: 185 },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(c1: Color, c2: Color, t: number): Color {
  return {
    r: Math.round(lerp(c1.r, c2.r, t)),
    g: Math.round(lerp(c1.g, c2.g, t)),
    b: Math.round(lerp(c1.b, c2.b, t)),
  };
}

class AuroraRibbon {
  w: number;
  h: number;
  y: number;
  amplitude: number;
  frequency: number;
  speed: number;
  t: number;
  thickness: number;
  ci: number;
  nci: number;
  ct: number;
  cs: number;
  alpha: number;

  constructor(w: number, h: number, i: number) {
    this.w = w;
    this.h = h;
    this.y = h * (0.15 + i * 0.2);
    this.amplitude = 60 + Math.random() * 80;
    this.frequency = 0.003 + Math.random() * 0.002;
    this.speed = 0.004 + Math.random() * 0.003;
    this.t = Math.random() * Math.PI * 2;
    this.thickness = 80 + Math.random() * 100;
    this.ci = (i * 2) % COLORS.length;
    this.nci = (i * 2 + 4) % COLORS.length;
    this.ct = Math.random();
    this.cs = 0.001 + Math.random() * 0.001;
    this.alpha = 0.045 + Math.random() * 0.035;
  }

  update() {
    this.t += this.speed;
    this.ct += this.cs;
    if (this.ct >= 1) {
      this.ct = 0;
      this.ci = this.nci;
      this.nci = Math.floor(Math.random() * COLORS.length);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { r, g, b } = lerpColor(COLORS[this.ci], COLORS[this.nci], this.ct);
    for (let x = 0; x <= this.w; x += 3) {
      const wave =
        Math.sin(x * this.frequency + this.t) * this.amplitude +
        Math.sin(x * this.frequency * 1.6 + this.t * 0.7) *
          (this.amplitude * 0.4);
      const cy = this.y + wave;
      const grad = ctx.createLinearGradient(
        x,
        cy - this.thickness,
        x,
        cy + this.thickness,
      );
      grad.addColorStop(0, `rgba(${r},${g},${b},0)`);
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${this.alpha})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(x, cy - this.thickness, 3, this.thickness * 2);
    }
  }
}

class Sparkle {
  w: number;
  h: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  maxAlpha: number;
  fadeIn: boolean;
  fadeSpeed: number;
  color: Color;

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.r = 0;
    this.alpha = 0;
    this.maxAlpha = 0;
    this.fadeIn = true;
    this.fadeSpeed = 0;
    this.color = COLORS[0];
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.w;
    this.y = Math.random() * this.h;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -0.2 - Math.random() * 0.4;
    this.r = 1 + Math.random() * 1.5;
    this.alpha = 0;
    this.maxAlpha = 0.5 + Math.random() * 0.4;
    this.fadeIn = true;
    this.fadeSpeed = 0.005 + Math.random() * 0.005;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.fadeIn) {
      this.alpha += this.fadeSpeed;
      if (this.alpha >= this.maxAlpha) this.fadeIn = false;
    } else {
      this.alpha -= this.fadeSpeed * 0.5;
    }
    if (this.alpha <= 0 || this.y < -10) this.reset();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { r, g, b } = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},${this.alpha})`;
    ctx.fill();
  }
}

export default function BackgroundAnimation({ children }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorScheme = useComputedColorScheme('dark');
  const bgColor = colorScheme === 'dark' ? '#0a0b0f' : '#d6d8d5';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ribbons: AuroraRibbon[] = [];
    let sparkles: Sparkle[] = [];
    let raf = 0;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const W = canvas.width,
        H = canvas.height;
      ribbons = Array.from({ length: 4 }, (_, i) => new AuroraRibbon(W, H, i));
      sparkles = Array.from({ length: 90 }, () => new Sparkle(W, H));
    };

    window.addEventListener('resize', init);
    init();

    const render = () => {
      const W = canvas.width,
        H = canvas.height;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);
      ribbons.forEach((r) => {
        r.update();
        r.draw(ctx);
      });
      sparkles.forEach((s) => {
        s.update();
        s.draw(ctx);
      });
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', init);
      cancelAnimationFrame(raf);
    };
  }, [bgColor]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        background: bgColor,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
      {children && (
        <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
      )}
    </div>
  );
}
