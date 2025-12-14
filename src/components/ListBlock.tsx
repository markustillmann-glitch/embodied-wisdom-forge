import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ListBlockProps {
  items: ReactNode[];
  ordered?: boolean;
}

export const ListBlock = ({ items, ordered = false }: ListBlockProps) => {
  const Tag = ordered ? "ol" : "ul";
  
  return (
    <Tag className={`space-y-3 my-4 ${ordered ? "list-decimal" : "list-disc"} pl-6`}>
      {items.map((item, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05, duration: 0.4 }}
          className="text-foreground/80 leading-relaxed"
        >
          {item}
        </motion.li>
      ))}
    </Tag>
  );
};
