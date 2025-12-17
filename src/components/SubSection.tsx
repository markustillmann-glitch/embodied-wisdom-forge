import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SubSectionProps {
  number: string;
  title: string;
  children: ReactNode;
}

export const SubSection = ({ number, title, children }: SubSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="mt-8 sm:mt-10 md:mt-12 first:mt-0"
    >
      <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-medium text-foreground mb-3 sm:mb-4 flex items-baseline gap-2 sm:gap-3 tracking-tight">
        <span className="text-accent font-sans text-sm sm:text-base">{number}</span>
        {title}
      </h3>
      <div className="space-y-3 sm:space-y-4 text-foreground/80 text-sm sm:text-base">
        {children}
      </div>
    </motion.div>
  );
};