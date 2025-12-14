import { motion } from "framer-motion";

interface ChapterNavProps {
  chapters: { id: string; title: string; number?: string }[];
  activeChapter: string;
  onChapterClick: (id: string) => void;
}

export const ChapterNav = ({ chapters, activeChapter, onChapterClick }: ChapterNavProps) => {
  return (
    <nav className="hidden lg:block fixed left-8 top-1/2 -translate-y-1/2 z-50">
      <ul className="space-y-3">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <button
              onClick={() => onChapterClick(chapter.id)}
              className="group flex items-center gap-3 text-left"
            >
              <motion.span
                className={`block w-2 h-2 rounded-full transition-all duration-300 ${
                  activeChapter === chapter.id
                    ? "bg-accent scale-125"
                    : "bg-border group-hover:bg-muted-foreground"
                }`}
                layoutId="chapter-indicator"
              />
              <span
                className={`text-sm font-sans transition-all duration-300 ${
                  activeChapter === chapter.id
                    ? "text-foreground opacity-100"
                    : "text-muted-foreground opacity-0 group-hover:opacity-100"
                }`}
              >
                {chapter.number && <span className="text-accent mr-1">{chapter.number}</span>}
                {chapter.title}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
