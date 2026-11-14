'use client';

import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ConcoursParticles() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles-concours"
      init={particlesInit}
      className="absolute inset-0 z-0"
      options={{
        background: {
          color: {
            value: "#0f172a", // slate 900
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "bubble",
            },
            resize: true,
          },
          modes: {
            bubble: {
              distance: 250,
              duration: 2,
              size: 10,
              opacity: 0.8
            },
          },
        },
        particles: {
          color: {
            value: ["#3b82f6", "#eab308", "#ef4444", "#22c55e"], // blue, yellow, red, green
          },
          move: {
            direction: "top",
            enable: true,
            outModes: {
              default: "out",
            },
            random: true,
            speed: 2,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 100,
          },
          opacity: {
            value: 0.7,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 2, max: 6 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
