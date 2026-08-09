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
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(" ");
  const totalChars = text.length;
  let charCounter = 0;

  return (
    <p id="animated-scroll-text" ref={containerRef} className={className}>
      {words.map((word, wordIdx) => {
        const wordChars = word.split("");
        
        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
            {wordChars.map((char) => {
              const charIndex = charCounter++;
              // Distribute characters over the scroll range (0.0 to 1.0)
              const start = charIndex / totalChars;
              const end = Math.min(1.0, start + 0.12); // smooth transition window

              return (
                <Character
                  key={charIndex}
                  char={char}
                  progress={scrollYProgress}
                  range={[start, end]}
                />
              );
            })}
          </span>
        );
      })}
    </p>
  );
}

interface CharacterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
  key?: any;
}

function Character({ char, progress, range }: CharacterProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block">
      <span className="opacity-0 select-none" aria-hidden="true">
        {char}
      </span>
      <motion.span
        style={{ opacity }}
        className="absolute top-0 left-0"
      >
        {char}
      </motion.span>
    </span>
  );
}
