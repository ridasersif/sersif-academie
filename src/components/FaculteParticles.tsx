'use client';

import { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function FaculteParticles() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles-faculte"
      init={particlesInit}
      className="absolute inset-0 z-0"
      options={{
        background: {
          color: {
            value: "#022c22", // dark emerald
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "#10b981", // emerald
          },
          links: {
            color: "#10b981",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
            triangles: {
              enable: true,
              opacity: 0.05
            }
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 60,
          },
          opacity: {
            value: 0.6,
          },
          shape: {
            type: "polygon",
            options: {
              polygon: {
                sides: 6,
              }
            }
          },
          size: {
            value: { min: 2, max: 4 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
