import { ReactNode } from "react";

interface HighlightProps {
  children: ReactNode;
  icon?: string;
}

export const Highlight = ({ children, icon = "👉" }: HighlightProps) => {
  return (
    <p className="flex items-start gap-3 bg-accent/10 border border-accent/20 rounded-lg p-4 my-4">
      <span className="text-lg flex-shrink-0">{icon}</span>
      <span className="text-foreground/90 font-medium">{children}</span>
    </p>
  );
};
