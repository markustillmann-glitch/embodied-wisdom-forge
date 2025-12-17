import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Sparkles,
  Pencil,
  Check,
  X,
  BookOpen,
  Image as ImageIcon,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import jsPDF from 'jspdf';

interface Memory {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  memory_type: string;
  emotion: string | null;
  created_at: string;
  memory_date: string | null;
  additional_thoughts: string | null;
  image_url: string | null;
  feeling_after: string[] | null;
  needs_after: string[] | null;
}

interface BookPage {
  id: string;
  type: 'cover' | 'title' | 'chapter' | 'image' | 'quote' | 'context' | 'reflection' | 'ending';
  title?: string;
  content?: string;
  imageUrl?: string;
  subtitle?: string;
}

interface MemoryBookProps {
  memory: Memory;
  open: boolean;
  onClose: () => void;
}

const MemoryBook: React.FC<MemoryBookProps> = ({ memory, open, onClose }) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const bookRef = useRef<HTMLDivElement>(null);
  const dateLocale = language === 'de' ? de : enUS;
  
  const [pages, setPages] = useState<BookPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddingContext, setIsAddingContext] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [editingPage, setEditingPage] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isGeneratingPageImage, setIsGeneratingPageImage] = useState(false);
  
  // Swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && currentPage < pages.length - 1) {
      setCurrentPage(p => p + 1);
    } else if (isRightSwipe && currentPage > 0) {
      setCurrentPage(p => p - 1);
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  useEffect(() => {
    if (open && memory) {
      generateBook();
    }
  }, [open, memory]);

  const generateBook = async () => {
    setIsGenerating(true);
    setCurrentPage(0);

    try {
      const response = await supabase.functions.invoke('generate-memory-book', {
        body: {
          memory: {
            title: memory.title,
            summary: memory.summary,
            content: memory.content,
            memory_type: memory.memory_type,
            emotion: memory.emotion,
            memory_date: memory.memory_date,
            additional_thoughts: memory.additional_thoughts,
            feeling_after: memory.feeling_after,
            needs_after: memory.needs_after,
            image_url: memory.image_url,
          },
          language,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setPages(response.data.pages || []);
    } catch (error) {
      console.error('Error generating book:', error);
      toast({
        title: t('vault.book.error'),
        description: t('vault.book.errorDesc'),
        variant: 'destructive',
      });
      // Create a basic fallback book
      createFallbackBook();
    }

    setIsGenerating(false);
  };

  const createFallbackBook = () => {
    const memoryDate = memory.memory_date ? new Date(memory.memory_date) : new Date(memory.created_at);
    const basicPages: BookPage[] = [
      {
        id: 'cover',
        type: 'cover',
        title: memory.title,
        subtitle: format(memoryDate, 'PPP', { locale: dateLocale }),
        imageUrl: memory.image_url || undefined,
      },
      {
        id: 'title',
        type: 'title',
        title: memory.title,
        content: memory.summary || '',
      },
      {
        id: 'main',
        type: 'chapter',
        title: t('vault.book.theMemory'),
        content: memory.content,
      },
    ];

    if (memory.emotion || (memory.feeling_after && memory.feeling_after.length > 0)) {
      basicPages.push({
        id: 'feelings',
        type: 'reflection',
        title: t('vault.book.feelings'),
        content: [
          memory.emotion ? `${t('vault.emotion')}: ${memory.emotion}` : '',
          memory.feeling_after?.length ? `${t('vault.feelingAfter')}: ${memory.feeling_after.join(', ')}` : '',
          memory.needs_after?.length ? `${t('vault.needsAfter')}: ${memory.needs_after.join(', ')}` : '',
        ].filter(Boolean).join('\n\n'),
      });
    }

    if (memory.additional_thoughts) {
      basicPages.push({
        id: 'thoughts',
        type: 'reflection',
        title: t('vault.additionalThoughts'),
        content: memory.additional_thoughts,
      });
    }

    basicPages.push({
      id: 'ending',
      type: 'ending',
      title: t('vault.book.endTitle'),
      content: t('vault.book.endContent'),
    });

    setPages(basicPages);
  };

  const addContextInfo = async () => {
    setIsAddingContext(true);

    try {
      const response = await supabase.functions.invoke('generate-memory-book', {
        body: {
          memory: {
            title: memory.title,
            summary: memory.summary,
            content: memory.content,
            memory_type: memory.memory_type,
            emotion: memory.emotion,
            memory_date: memory.memory_date,
            additional_thoughts: memory.additional_thoughts,
            feeling_after: memory.feeling_after,
            needs_after: memory.needs_after,
          },
          language,
          addContext: true,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const contextPages = response.data.contextPages || [];
      if (contextPages.length > 0) {
        // Insert context pages before the ending page
        const endingIndex = pages.findIndex(p => p.type === 'ending');
        const newPages = [...pages];
        if (endingIndex >= 0) {
          newPages.splice(endingIndex, 0, ...contextPages);
        } else {
          newPages.push(...contextPages);
        }
        setPages(newPages);
        toast({
          title: t('vault.book.contextAdded'),
          description: t('vault.book.contextAddedDesc'),
        });
      }
    } catch (error) {
      console.error('Error adding context:', error);
      toast({
        title: t('vault.book.error'),
        description: t('vault.book.contextError'),
        variant: 'destructive',
      });
    }

    setIsAddingContext(false);
  };

  const startEditing = (pageIndex: number) => {
    const page = pages[pageIndex];
    setEditTitle(page.title || '');
    setEditContent(page.content || '');
    setEditingPage(pageIndex);
  };

  const saveEdit = () => {
    if (editingPage === null) return;
    
    const newPages = [...pages];
    newPages[editingPage] = {
      ...newPages[editingPage],
      title: editTitle,
      content: editContent,
    };
    setPages(newPages);
    setEditingPage(null);
  };

  const cancelEdit = () => {
    setEditingPage(null);
    setEditTitle('');
    setEditContent('');
  };

  const generatePageImage = async (pageIndex: number) => {
    setIsGeneratingPageImage(true);
    const page = pages[pageIndex];

    try {
      const response = await supabase.functions.invoke('generate-memory-image', {
        body: {
          title: page.title || memory.title,
          summary: page.content?.substring(0, 200) || memory.summary,
          emotion: memory.emotion,
          memoryType: memory.memory_type,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { imageUrl } = response.data;
      if (imageUrl) {
        const newPages = [...pages];
        newPages[pageIndex] = {
          ...newPages[pageIndex],
          imageUrl: imageUrl,
        };
        setPages(newPages);
        toast({
          title: t('vault.imageGenerated'),
          description: t('vault.imageGeneratedDesc'),
        });
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: t('vault.error'),
        description: t('vault.imageError'),
        variant: 'destructive',
      });
    }

    setIsGeneratingPageImage(false);
  };

  const exportToPDF = async () => {
    setIsExporting(true);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        if (i > 0) {
          pdf.addPage();
        }

        // Background
        pdf.setFillColor(250, 250, 248);
        pdf.rect(0, 0, pageWidth, pageHeight, 'F');

        let yPos = margin;

        // Handle different page types
        if (page.type === 'cover') {
          // Cover page
          if (page.imageUrl) {
            try {
              pdf.addImage(page.imageUrl, 'JPEG', margin, margin, contentWidth, 100);
              yPos = margin + 110;
            } catch (e) {
              yPos = margin + 20;
            }
          } else {
            yPos = pageHeight / 3;
          }
          
          pdf.setFontSize(28);
          pdf.setTextColor(30, 30, 30);
          pdf.text(page.title || '', pageWidth / 2, yPos, { align: 'center' });
          
          if (page.subtitle) {
            pdf.setFontSize(14);
            pdf.setTextColor(100, 100, 100);
            pdf.text(page.subtitle, pageWidth / 2, yPos + 15, { align: 'center' });
          }
        } else if (page.type === 'image' && page.imageUrl) {
          // Image page
          try {
            pdf.addImage(page.imageUrl, 'JPEG', margin, margin, contentWidth, 150);
            yPos = margin + 160;
          } catch (e) {
            // Skip image if failed
          }
          
          if (page.title) {
            pdf.setFontSize(12);
            pdf.setTextColor(100, 100, 100);
            pdf.text(page.title, pageWidth / 2, yPos, { align: 'center' });
          }
        } else if (page.type === 'quote') {
          // Quote page
          yPos = pageHeight / 3;
          pdf.setFontSize(18);
          pdf.setTextColor(80, 80, 80);
          const quoteLines = pdf.splitTextToSize(`"${page.content}"`, contentWidth - 20);
          pdf.text(quoteLines, pageWidth / 2, yPos, { align: 'center' });
        } else {
          // Standard page with title and content
          if (page.title) {
            pdf.setFontSize(18);
            pdf.setTextColor(30, 30, 30);
            pdf.text(page.title, margin, yPos);
            yPos += 15;
          }

          if (page.imageUrl) {
            try {
              pdf.addImage(page.imageUrl, 'JPEG', margin, yPos, contentWidth, 80);
              yPos += 90;
            } catch (e) {
              // Skip image if failed
            }
          }

          if (page.content) {
            pdf.setFontSize(11);
            pdf.setTextColor(60, 60, 60);
            const lines = pdf.splitTextToSize(page.content, contentWidth);
            pdf.text(lines, margin, yPos);
          }
        }

        // Page number
        if (page.type !== 'cover') {
          pdf.setFontSize(10);
          pdf.setTextColor(150, 150, 150);
          pdf.text(`${i + 1}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        }
      }

      pdf.save(`${memory.title.replace(/[^a-z0-9]/gi, '_')}_book.pdf`);
      
      toast({
        title: t('vault.book.exported'),
        description: t('vault.book.exportedDesc'),
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: t('vault.book.error'),
        description: t('vault.book.exportError'),
        variant: 'destructive',
      });
    }

    setIsExporting(false);
  };

  const renderPage = (page: BookPage, index: number) => {
    const isEditing = editingPage === index;

    if (page.type === 'cover') {
      return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-accent/5 to-background">
          {page.imageUrl && (
            <div className="w-full max-w-xs h-48 mb-6 rounded-xl overflow-hidden shadow-lg">
              <img src={page.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <h1 className="font-serif text-3xl md:text-4xl mb-4 text-foreground">{page.title}</h1>
          {page.subtitle && (
            <p className="text-muted-foreground text-lg">{page.subtitle}</p>
          )}
          <div className="mt-8 flex items-center gap-2 text-accent">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-medium">{t('vault.book.memoryBook')}</span>
          </div>
        </div>
      );
    }

    if (page.type === 'image') {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8">
          {page.imageUrl ? (
            <>
              <div className="w-full max-w-md rounded-xl overflow-hidden shadow-lg mb-4">
                <img src={page.imageUrl} alt="" className="w-full object-cover" />
              </div>
              {page.title && (
                <p className="text-sm text-muted-foreground italic text-center">{page.title}</p>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => generatePageImage(index)}
                disabled={isGeneratingPageImage}
              >
                {isGeneratingPageImage ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {t('vault.generateImage')}
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (page.type === 'quote') {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-accent/5">
          <div className="max-w-lg">
            <p className="font-serif text-2xl md:text-3xl italic text-foreground/80 leading-relaxed">
              "{isEditing ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="text-2xl font-serif italic text-center min-h-[150px]"
                />
              ) : page.content}"
            </p>
          </div>
        </div>
      );
    }

    if (page.type === 'ending') {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-t from-accent/5 to-background">
          <BookOpen className="h-12 w-12 text-accent mb-6" />
          <h2 className="font-serif text-2xl mb-4 text-foreground">{page.title}</h2>
          <p className="text-muted-foreground max-w-md">{page.content}</p>
        </div>
      );
    }

    // Standard content page
    return (
      <div className="h-full flex flex-col p-8 overflow-y-auto">
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-serif text-xl"
              placeholder={t('vault.book.titlePlaceholder')}
            />
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[300px]"
              placeholder={t('vault.book.contentPlaceholder')}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveEdit}>
                <Check className="h-4 w-4 mr-2" />
                {t('vault.save')}
              </Button>
              <Button size="sm" variant="outline" onClick={cancelEdit}>
                <X className="h-4 w-4 mr-2" />
                {t('vault.cancel')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {page.title && (
              <h2 className="font-serif text-2xl mb-6 text-foreground border-b border-border pb-4">
                {page.title}
              </h2>
            )}
            {page.imageUrl && (
              <div className="w-full rounded-lg overflow-hidden mb-6 shadow-md">
                <img src={page.imageUrl} alt="" className="w-full h-48 object-cover" />
              </div>
            )}
            {page.content && (
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap flex-1">
                {page.content}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => startEditing(index)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              {!page.imageUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => generatePageImage(index)}
                  disabled={isGeneratingPageImage}
                >
                  {isGeneratingPageImage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-accent" />
              {t('vault.book.title')}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={addContextInfo}
                disabled={isAddingContext || isGenerating}
              >
                {isAddingContext ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {t('vault.book.addContext')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToPDF}
                disabled={isExporting || isGenerating || pages.length === 0}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Book Content */}
        <div 
          className="flex-1 relative overflow-hidden bg-secondary/30" 
          ref={bookRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-accent mb-4" />
              <p className="text-muted-foreground">{t('vault.book.generating')}</p>
            </div>
          ) : pages.length > 0 ? (
            <div className="h-full">
              {/* Page Display */}
              <div className="h-full bg-background rounded-lg shadow-lg mx-4 my-4 overflow-hidden">
                {renderPage(pages[currentPage], currentPage)}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              {t('vault.book.noContent')}
            </div>
          )}
        </div>

        {/* Navigation */}
        {pages.length > 0 && (
          <div className="p-4 border-t border-border shrink-0 flex items-center justify-between bg-background">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t('vault.book.previous')}
            </Button>
            
            <div className="flex items-center gap-2">
              {pages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === currentPage 
                      ? "bg-accent w-4" 
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                />
              ))}
              <span className="ml-4 text-sm text-muted-foreground">
                {currentPage + 1} / {pages.length}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
              disabled={currentPage === pages.length - 1}
            >
              {t('vault.book.next')}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MemoryBook;
