import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);

  const visibleRef = useRef(false);
  const hoverRef = useRef(false);
  const inputRef = useRef(false);

  // Set the initial coordinate off-screen so there's no flicker on mount
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring behavior for the cursor
  const springConfig = { damping: 30, stiffness: 350, mass: 0.5 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    setIsMounted(true);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      visibleRef.current = false;
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      visibleRef.current = true;
      setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Detect if hovering interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInput = Boolean(
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      );

      if (inputRef.current !== isInput) {
        inputRef.current = isInput;
        setIsTextInput(isInput);
      }

      const hoverState =
        !isInput &&
        Boolean(
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'LABEL' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('[role="button"]') ||
          target.classList.contains('cursor-pointer')
        );

      if (hoverRef.current !== hoverState) {
        hoverRef.current = hoverState;
        setIsHovering(hoverState);
      }
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Disable custom cursor on touch screens to preserve accessibility
  if (!isMounted || (typeof window !== 'undefined' && 'ontouchstart' in window)) {
    return null;
  }

  return (
    <motion.div
      id="custom-cursor"
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block will-change-transform"
      style={{
        x,
        y,
        opacity: isVisible && !isTextInput ? 1 : 0,
        scale: isHovering ? 1.4 : 1,
      }}
      transition={{
        opacity: { duration: 0.15 },
        scale: { type: 'spring', damping: 20, stiffness: 300 }
      }}
    >
      <img
        src="https://res.cloudinary.com/tcljt08i/image/upload/ar_1.0,c_pad,b_transparent,w_64,h_64,f_png,q_auto/green-b_wu1gkz"
        alt="Custom Green-B Cursor"
        className="w-10 h-10 object-contain drop-shadow-[0_4px_12px_rgba(187,237,28,0.4)] pointer-events-none"
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
}
