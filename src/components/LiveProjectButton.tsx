import { motion } from 'motion/react';

interface LiveProjectButtonProps {
  onClick?: () => void;
  className?: string;
}

export function LiveProjectButton({ onClick, className = '' }: LiveProjectButtonProps) {
  return (
    <motion.button
      id="live-project-button-element"
      onClick={onClick}
      whileHover={{ scale: 1.03, backgroundColor: 'rgba(215, 226, 234, 0.1)' }}
      whileTap={{ scale: 0.97 }}
      className={`rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-[0.15em] transition-colors cursor-pointer px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base ${className}`}
    >
      Live Project
    </motion.button>
  );
}
