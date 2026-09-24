"use client";

import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal component for smooth, GPU-accelerated scroll and incoming animations.
 * 
 * @param {Object} props
 * @param {ReactNode} props.children
 * @param {'fade-up' | 'fade-down' | 'fade-in' | 'scale-up'} [props.animation='fade-up']
 * @param {number} [props.delay=0] Delay in milliseconds
 * @param {number} [props.duration=800] Duration in milliseconds
 * @param {string} [props.className=''] Additional class names
 * @param {string} [props.as='div'] HTML element tag
 * @param {boolean} [props.once=true] Whether animation should only trigger once
 * @param {number} [props.threshold=0.12] Observer threshold
 */
export default function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  className = '',
  as: Component = 'div',
  once = true,
  threshold = 0.12,
  ...rest
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [once, threshold]);

  const animationClass = {
    'fade-up': 'reveal-fade-up',
    'fade-down': 'reveal-fade-down',
    'fade-in': 'reveal-fade-in',
    'scale-up': 'reveal-scale-up',
  }[animation] || 'reveal-fade-up';

  const inlineStyles = {
    transitionDelay: `${delay}ms`,
    transitionDuration: `${duration}ms`,
  };

  return (
    <Component
      ref={ref}
      style={inlineStyles}
      className={`reveal-init ${animationClass} ${isVisible ? 'reveal-active' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}
