'use client';
import { Particles } from '@tsparticles/react';

export default function ParticulasFondo() {
  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        background: { color: { value: '#e3f0fc' } },
        particles: {
          number: { value: 40, density: { enable: true, width: 800 } },
          color: { value: ['#2563eb', '#38bdf8', '#64748b', '#0ea5e9'] },
          shape: {
            type: ['circle', 'square']
          },
          links: { enable: true, color: '#1976d2', opacity: 0.18 },
          move: { enable: true, speed: 1 },
          size: { value: 18 },
          opacity: { value: 0.6 },
        },
        interactivity: {
          events: { onHover: { enable: true, mode: 'repulse' } },
          modes: { repulse: { distance: 120 } },
        },
        detectRetina: true,
      }}
    />
  );
}
