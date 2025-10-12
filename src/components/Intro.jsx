import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import '../styles/Intro.css';

export default function Intro({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Timeline for intro animation
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        if (onFinish) onFinish(); // Show console after intro
      },
    });

    tl.to('.intro-screen', { opacity: 1, duration: 0.5 })
      .fromTo(
        '.intro-text',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.5, duration: 1 }
      )
      .to('.intro-screen', { opacity: 0, duration: 0.8, delay: 0.5 });
  }, [onFinish]);

  if (!visible) return null;

  return (
    <div className="intro-screen">
      <div className="intro-text">Initializing JARVIS...</div>
      <div className="intro-text">Loading Systems...</div>
      <div className="intro-text">Preparing Console Interface...</div>
    </div>
  );
}
