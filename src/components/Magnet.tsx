import { useRef, useEffect, ReactNode } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
}

export function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable magnet on touch devices to conserve battery & performance
    if (typeof window !== 'undefined' && ('ontouchstart' in window || window.innerWidth < 768)) {
      return;
    }

    let isVisible = true;
    let rafId: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { rootMargin: '100px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible || !ref.current) return;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        const elementEdge = Math.max(rect.width, rect.height) / 2;
        const threshold = elementEdge + padding;

        if (distance < threshold) {
          ref.current.style.transition = activeTransition;
          ref.current.style.transform = `translate3d(${distanceX / strength}px, ${distanceY / strength}px, 0)`;
        } else {
          ref.current.style.transition = inactiveTransition;
          ref.current.style.transform = `translate3d(0px, 0px, 0px)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={ref}
      style={{
        transform: 'translate3d(0px, 0px, 0px)',
        transition: inactiveTransition,
        willChange: 'transform',
      }}
      className="inline-block"
    >
      {children}
    </div>
  );
}

