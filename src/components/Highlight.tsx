import { ReactNode } from "react";

interface HighlightProps {
  children: ReactNode;
  icon?: string;
}

export const Highlight = ({ children, icon = "👉" }: HighlightProps) => {
  return (
    <p className="flex items-start gap-3 bg-accent/10 border border-accent/20 rounded-lg p-4 sm:p-5 my-4 sm:my-5">
      <span className="text-base sm:text-lg flex-shrink-0">{icon}</span>
      <span className="text-foreground/90 font-medium text-sm sm:text-base leading-relaxed">{children}</span>
    </p>
  );
};