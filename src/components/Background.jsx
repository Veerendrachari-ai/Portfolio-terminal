import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import '../styles/Background.css';

export default function Background() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return; // Safety check

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.className = 'background-canvas';

    mountRef.current.appendChild(renderer.domElement);

    // Particle system
    const particleCount = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x00e6c3,
      size: 0.02,
      transparent: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    // Handle resize
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // Animate particles
    let frame = 0;
    let animationId;

    const animate = () => {
      frame += 0.01;
      points.rotation.x = frame * 0.02;
      points.rotation.y = frame * 0.01;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
}
