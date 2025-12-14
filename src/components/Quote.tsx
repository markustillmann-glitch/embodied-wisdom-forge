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
      className="relative my-8 py-6 px-8 bg-quote-bg border-l-4 border-accent rounded-r-lg"
    >
      <span className="absolute -left-3 -top-2 text-6xl text-accent/30 font-serif">"</span>
      <p className="text-lg md:text-xl font-serif italic text-foreground/90 leading-relaxed">
        {children}
      </p>
    </motion.blockquote>
  );
};
