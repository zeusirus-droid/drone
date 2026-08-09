import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

export function AnimatedText({ text, className = "" }: AnimatedTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.3'],
  });

  const words = text.split(" ");
  const totalWords = words.length;

  return (
    <p id="animated-scroll-text" ref={containerRef} className={className}>
      {words.map((word, wordIdx) => {
        const start = wordIdx / totalWords;
        const end = Math.min(1.0, start + 0.15);

        return (
          <Word
            key={wordIdx}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}

interface WordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  key?: any;
}

function Word({ word, progress, range }: WordProps) {
  const opacity = useTransform(progress, range, [0.25, 1]);

  return (
    <span className="relative inline-block mr-[0.3em] whitespace-nowrap">
      <span className="opacity-0 select-none" aria-hidden="true">
        {word}
      </span>
      <motion.span
        style={{ opacity }}
        className="absolute top-0 left-0"
      >
        {word}
      </motion.span>
    </span>
  );
}
