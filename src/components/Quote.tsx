import { motion } from "framer-motion";
import { ReactNode } from "react";

interface QuoteProps {
  children: ReactNode;
}

export const Quote = ({ children }: QuoteProps) => {
  return (
    <motion.blockquote
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="relative my-6 sm:my-8 py-5 sm:py-6 px-6 sm:px-8 bg-quote-bg border-l-4 border-accent rounded-r-lg"
    >
      <span className="absolute -left-2 sm:-left-3 -top-1 sm:-top-2 text-5xl sm:text-6xl text-accent/30 font-serif">"</span>
      <p className="text-base sm:text-lg md:text-xl font-serif italic text-foreground/90 leading-relaxed">
        {children}
      </p>
    </motion.blockquote>
  );
};