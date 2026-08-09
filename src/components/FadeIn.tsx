import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: string;
  className?: string;
  id?: string;
  onClick?: () => void;
  key?: any;
}

const motionComponentCache: Record<string, any> = {};

function getMotionComponent(asTag: string) {
  if (asTag === 'div' || !asTag) return motion.div;
  if ((motion as any)[asTag]) return (motion as any)[asTag];
  if (!motionComponentCache[asTag]) {
    motionComponentCache[asTag] = motion.create(asTag as any);
  }
  return motionComponentCache[asTag];
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className = '',
  id,
  onClick,
}: FadeInProps) {
  const MotionComponent = getMotionComponent(as);

  return (
    <MotionComponent
      id={id}
      className={className}
      onClick={onClick}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -20px 0px", amount: 0.05 }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </MotionComponent>
  );
}

