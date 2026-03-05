"use client";

import { useEffect, useRef } from "react";

interface Props {
  spaceId: string;
  accent: [number, number, number];
}

export default function SpaceBackground({ spaceId, accent }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const [ar, ag, ab] = accent;

    // Particles for each space
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];
    const maxParticles = spaceId === "rooftop" ? 80 : spaceId === "drive" ? 40 : 30;

    function createParticle(): Particle {
      switch (spaceId) {
        case "rooftop":
          return {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.1,
            vy: -Math.random() * 0.15 - 0.02,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.6 + 0.1,
            life: 0,
            maxLife: Math.random() * 600 + 300,
          };
        case "drive":
          return {
            x: Math.random() * w,
            y: Math.random() * h * 0.4 + h * 0.3,
            vx: -Math.random() * 3 - 1,
            vy: (Math.random() - 0.5) * 0.2,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.4 + 0.1,
            life: 0,
            maxLife: Math.random() * 120 + 60,
          };
        case "fire-escape":
          return {
            x: Math.random() * w,
            y: h + 5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -Math.random() * 0.4 - 0.1,
            size: Math.random() * 1.2 + 0.3,
            opacity: Math.random() * 0.3 + 0.05,
            life: 0,
            maxLife: Math.random() * 400 + 200,
          };
        case "apartment":
          return {
            x: Math.random() * w,
            y: Math.random() * h * 0.3,
            vx: (Math.random() - 0.5) * 0.05,
            vy: Math.random() * 0.08 + 0.01,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.15 + 0.03,
            life: 0,
            maxLife: Math.random() * 800 + 400,
          };
        case "kitchen-floor":
          return {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: 0,
            vy: 0,
            size: Math.random() * 1 + 0.2,
            opacity: Math.random() * 0.08 + 0.02,
            life: 0,
            maxLife: Math.random() * 1000 + 500,
          };
        default:
          return {
            x: Math.random() * w,
            y: Math.random() * h,
            vx: 0,
            vy: -0.1,
            size: 1,
            opacity: 0.3,
            life: 0,
            maxLife: 400,
          };
      }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      const p = createParticle();
      p.life = Math.random() * p.maxLife; // stagger
      particles.push(p);
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      // Subtle gradient base
      const grad = ctx!.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.5, w * 0.8);
      grad.addColorStop(0, `rgba(${ar}, ${ag}, ${ab}, 0.03)`);
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx!.fillStyle = grad;
      ctx!.fillRect(0, 0, w, h);

      // Drive-specific: road lines
      if (spaceId === "drive") {
        ctx!.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, 0.06)`;
        ctx!.lineWidth = 2;
        const time = Date.now() * 0.001;
        for (let i = 0; i < 5; i++) {
          const y = h * 0.55 + i * 20;
          const offset = ((time * 100 + i * 200) % (w + 200)) - 100;
          ctx!.beginPath();
          ctx!.moveTo(offset, y);
          ctx!.lineTo(offset + 60, y);
          ctx!.stroke();
        }
      }

      // Fire-escape: window glow
      if (spaceId === "fire-escape") {
        const glow = ctx!.createRadialGradient(w * 0.7, h * 0.4, 0, w * 0.7, h * 0.4, 150);
        glow.addColorStop(0, `rgba(${ar}, ${ag}, ${ab}, 0.05)`);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx!.fillStyle = glow;
        ctx!.fillRect(0, 0, w, h);
      }

      // Apartment: string light effect
      if (spaceId === "apartment") {
        const time = Date.now() * 0.0008;
        for (let i = 0; i < 8; i++) {
          const x = (w / 9) * (i + 1);
          const y = h * 0.08 + Math.sin(time + i * 0.7) * 3;
          const flicker = 0.08 + Math.sin(time * 1.5 + i * 2.3) * 0.03;
          const glow = ctx!.createRadialGradient(x, y, 0, x, y, 40);
          glow.addColorStop(0, `rgba(${ar}, ${ag}, ${ab}, ${flicker})`);
          glow.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx!.fillStyle = glow;
          ctx!.fillRect(x - 40, y - 40, 80, 80);
        }
        // catenary line connecting them
        ctx!.strokeStyle = `rgba(${ar}, ${ag}, ${ab}, 0.04)`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        for (let i = 0; i < 8; i++) {
          const x = (w / 9) * (i + 1);
          const y = h * 0.08 + Math.sin(time + i * 0.7) * 3;
          if (i === 0) ctx!.moveTo(x, y);
          else ctx!.lineTo(x, y);
        }
        ctx!.stroke();
      }

      // Kitchen floor: fridge hum pulse
      if (spaceId === "kitchen-floor") {
        const time = Date.now() * 0.0005;
        const pulse = 0.02 + Math.sin(time) * 0.01;
        const glow = ctx!.createRadialGradient(w * 0.15, h * 0.3, 0, w * 0.15, h * 0.3, 200);
        glow.addColorStop(0, `rgba(${ar}, ${ag}, ${ab}, ${pulse})`);
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx!.fillStyle = glow;
        ctx!.fillRect(0, 0, w, h);
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const lifeRatio = p.life / p.maxLife;
        const fadeIn = Math.min(lifeRatio * 5, 1);
        const fadeOut = lifeRatio > 0.8 ? 1 - (lifeRatio - 0.8) * 5 : 1;
        const alpha = p.opacity * fadeIn * fadeOut;

        if (spaceId === "rooftop") {
          // Twinkling stars
          const twinkle = 0.5 + Math.sin(Date.now() * 0.003 + i * 1.7) * 0.5;
          ctx!.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${alpha * twinkle})`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx!.fill();
        } else {
          ctx!.fillStyle = `rgba(${ar}, ${ag}, ${ab}, ${alpha})`;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx!.fill();
        }

        // Recycle particle
        if (p.life >= p.maxLife || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
          particles[i] = createParticle();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [spaceId, accent]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
