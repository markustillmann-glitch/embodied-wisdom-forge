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
      className="mt-12 first:mt-0"
    >
      <h3 className="text-xl md:text-2xl font-serif font-medium text-foreground mb-4 flex items-baseline gap-3">
        <span className="text-accent font-sans text-base">{number}</span>
        {title}
      </h3>
      <div className="space-y-4 text-foreground/80">
        {children}
      </div>
    </motion.div>
  );
};
