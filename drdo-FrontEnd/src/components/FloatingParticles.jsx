import React, { useEffect, useRef } from 'react';
import './FloatingParticles.css';

export default function FloatingParticles({ count = 40, speed = 1, interactive = true }) {
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing particles
    container.innerHTML = '';
    particlesRef.current = [];

    // Create particles with more variety
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      
      // Random properties with more variety
      const size = Math.random() * 6 + 2;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = (Math.random() * 25 + 15) / speed;
      const delay = Math.random() * 8;
      const opacity = Math.random() * 0.6 + 0.2;
      const blur = Math.random() * 2 + 0.5;
      
      // Different particle shapes
      const shapes = ['circle', 'square', 'triangle', 'diamond'];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      particle.classList.add(`shape-${shape}`);
      
      // Set styles
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.opacity = opacity;
      particle.style.filter = `blur(${blur}px)`;
      
      // Theme-aware colors
      const colors = [
        'var(--accent-primary)',
        'var(--button-bg)',
        'var(--text-secondary)',
        'rgba(255, 255, 255, 0.4)',
        'rgba(var(--accent-primary-rgb), 0.6)',
        'rgba(var(--button-bg-rgb), 0.5)'
      ];
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      // Store particle data for interaction
      particlesRef.current.push({
        element: particle,
        baseX: x,
        baseY: y,
        size: size
      });
      
      container.appendChild(particle);
    }

    // Mouse interaction
    const handleMouseMove = (e) => {
      if (!interactive) return;
      
      mouseRef.current.x = (e.clientX / window.innerWidth) * 100;
      mouseRef.current.y = (e.clientY / window.innerHeight) * 100;
      
      particlesRef.current.forEach((particleData, index) => {
        const { element, baseX, baseY, size } = particleData;
        const distance = Math.sqrt(
          Math.pow(mouseRef.current.x - baseX, 2) + 
          Math.pow(mouseRef.current.y - baseY, 2)
        );
        
        if (distance < 15) {
          const force = (15 - distance) / 15;
          const offsetX = (mouseRef.current.x - baseX) * force * 0.5;
          const offsetY = (mouseRef.current.y - baseY) * force * 0.5;
          
          element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${1 + force * 0.3})`;
          element.style.opacity = Math.min(1, parseFloat(element.style.opacity) + force * 0.3);
        } else {
          element.style.transform = 'translate(0, 0) scale(1)';
        }
      });
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      particlesRef.current = [];
    };
  }, [count, speed, interactive]);

  return <div ref={containerRef} className="floating-particles-container" />;
}