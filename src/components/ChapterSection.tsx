import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ChapterSectionProps {
  id?: string;
  number?: string;
  title: string;
  children: ReactNode;
}

export const ChapterSection = ({ id, number, title, children }: ChapterSectionProps) => {
  return (
    <section id={id} className="py-12 sm:py-16 md:py-20 scroll-mt-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
      >
        {number && (
          <span className="inline-block text-xs sm:text-sm font-sans font-medium tracking-widest text-accent uppercase mb-3 sm:mb-4">
            Kapitel {number}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium text-foreground mb-6 sm:mb-8 leading-tight tracking-tight">
          {title}
        </h2>
        <div className="space-y-5 sm:space-y-6 text-foreground/85 font-sans text-base sm:text-lg leading-relaxed">
          {children}
        </div>
      </motion.div>
    </section>
  );
};