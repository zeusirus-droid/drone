import { motion } from 'motion/react';

interface ContactButtonProps {
  onClick?: () => void;
  className?: string;
}

export function ContactButton({ onClick, className = '' }: ContactButtonProps) {
  return (
    <motion.button
      id="contact-button-element"
      onClick={onClick}
      whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
      whileTap={{ scale: 0.97 }}
      className={`rounded-full font-medium uppercase tracking-[0.2em] text-white cursor-pointer px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base transition-all duration-200 ${className}`}
      style={{
        background: 'linear-gradient(123deg, #051c02 7%, #3f7d02 37%, #7ba60c 72%, #bbed1c 100%)',
        boxShadow: '0px 4px 10px rgba(187, 237, 28, 0.35), inset 4px 4px 12px #7ba60c',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
    >
      Contact Us
    </motion.button>
  );
}
