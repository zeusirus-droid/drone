import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

export function WhatsAppFloating() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50 pointer-events-auto"
    >
      <motion.a
        href="https://wa.me/18687775994"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
                className="flex items-center justify-center w-14 h-14 rounded-full bg-[#bbed1c] text-[#0C0C0C] shadow-2xl border-2 border-white/20 hover:brightness-110 relative group"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        style={{
          boxShadow: '0 8px 30px rgba(187, 237, 28, 0.4)',
        }}
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -inset-[3px] rounded-full border-2 border-[#bbed1c]/40 animate-ping pointer-events-none" />
        
        {/* Hover label */}
        <span className="absolute right-16 bg-[#161616] text-[#D7E2EA] text-xs font-semibold uppercase tracking-[0.15em] px-4 py-2.5 rounded-xl opacity-0 scale-95 origin-right translate-x-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-[#D7E2EA]/10">
          Chat with us!
        </span>

        <MessageCircle className="w-7 h-7 fill-[#0C0C0C]/10 text-[#0C0C0C]" />
      </motion.a>
    </motion.div>
  );
}
