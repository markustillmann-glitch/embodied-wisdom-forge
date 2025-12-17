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
  Pencil,
  Check,
  X,
  BookOpen,
  Image as ImageIcon,
  Upload,
  ImagePlus,
  Trash2,
  Save,
  RefreshCw
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
  memory_book_data?: unknown;
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
  onBookSaved?: () => void;
}

const MemoryBook: React.FC<MemoryBookProps> = ({ memory, open, onClose, onBookSaved }) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const bookRef = useRef<HTMLDivElement>(null);
  const dateLocale = language === 'de' ? de : enUS;
  
  const [pages, setPages] = useState<BookPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddingContext, setIsAddingContext] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingPage, setEditingPage] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [isGeneratingPageImage, setIsGeneratingPageImage] = useState(false);
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const [editingImagePageIndex, setEditingImagePageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const imagePageFileInputRef = useRef<HTMLInputElement>(null);
  
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
      loadOrGenerateBook();
    }
  }, [open, memory]);

  const loadOrGenerateBook = async () => {
    // Check if there's saved book data
    const bookData = memory.memory_book_data;
    if (bookData && Array.isArray(bookData) && bookData.length > 0) {
      setPages(bookData as BookPage[]);
      setHasUnsavedChanges(false);
      setCurrentPage(0);
    } else {
      generateBook();
    }
  };

  const generateBook = async () => {
    setIsGenerating(true);
    setCurrentPage(0);
    setHasUnsavedChanges(true);

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

  const saveBook = async () => {
    setIsSaving(true);
    try {
      // Serialize pages to ensure clean JSON (remove any non-serializable data)
      const cleanPages = pages.map(page => ({
        id: page.id,
        type: page.type,
        title: page.title || undefined,
        content: page.content || undefined,
        imageUrl: page.imageUrl || undefined,
        subtitle: page.subtitle || undefined,
      }));

      const { error } = await supabase
        .from('memories')
        .update({ memory_book_data: cleanPages })
        .eq('id', memory.id);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Supabase error saving book:', error);
        }
        throw error;
      }

      setHasUnsavedChanges(false);
      toast({
        title: t('vault.book.saved'),
        description: t('vault.book.savedDesc'),
      });
      onBookSaved?.();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error saving book:', error);
      }
      toast({
        title: t('vault.book.error'),
        description: t('vault.book.saveError'),
        variant: 'destructive',
      });
    }
    setIsSaving(false);
  };

  const markUnsaved = () => {
    setHasUnsavedChanges(true);
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
        markUnsaved();
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
    markUnsaved();
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
        markUnsaved();
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

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      const coverIndex = pages.findIndex(p => p.type === 'cover');
      if (coverIndex >= 0) {
        const newPages = [...pages];
        newPages[coverIndex] = { ...newPages[coverIndex], imageUrl };
        setPages(newPages);
        markUnsaved();
      }
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (coverFileInputRef.current) {
      coverFileInputRef.current.value = '';
    }
  };

  const handleInsertImagePage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      const newImagePage: BookPage = {
        id: `image-${Date.now()}`,
        type: 'image',
        title: '',
        imageUrl,
      };
      
      // Insert after current page
      const newPages = [...pages];
      newPages.splice(currentPage + 1, 0, newImagePage);
      setPages(newPages);
      setCurrentPage(currentPage + 1);
      setShowInsertMenu(false);
      markUnsaved();
      
      toast({
        title: t('vault.book.imageInserted'),
        description: t('vault.book.imageInsertedDesc'),
      });
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReplacePageImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || editingImagePageIndex === null) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      const newPages = [...pages];
      newPages[editingImagePageIndex] = { ...newPages[editingImagePageIndex], imageUrl };
      setPages(newPages);
      markUnsaved();
      setEditingImagePageIndex(null);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (imagePageFileInputRef.current) {
      imagePageFileInputRef.current.value = '';
    }
  };

  const deletePage = (index: number) => {
    if (pages[index].type === 'cover' || pages[index].type === 'ending') return;
    
    const newPages = pages.filter((_, i) => i !== index);
    setPages(newPages);
    markUnsaved();
    if (currentPage >= newPages.length) {
      setCurrentPage(Math.max(0, newPages.length - 1));
    }
    toast({
      title: t('vault.book.pageDeleted'),
    });
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

      // Helper to detect image format from base64 or URL
      const getImageFormat = (url: string): string => {
        if (url.includes('data:image/png')) return 'PNG';
        if (url.includes('data:image/gif')) return 'GIF';
        if (url.includes('data:image/webp')) return 'WEBP';
        return 'JPEG';
      };

      // Helper to load and add image safely
      const addImageSafe = async (imageUrl: string, x: number, y: number, w: number, h: number): Promise<boolean> => {
        return new Promise((resolve) => {
          try {
            const format = getImageFormat(imageUrl);
            pdf.addImage(imageUrl, format, x, y, w, h);
            resolve(true);
          } catch (e) {
            console.warn('Failed to add image to PDF:', e);
            resolve(false);
          }
        });
      };

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
            const imageAdded = await addImageSafe(page.imageUrl, margin, margin, contentWidth, 100);
            yPos = imageAdded ? margin + 110 : margin + 20;
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
          const imageAdded = await addImageSafe(page.imageUrl, margin, margin, contentWidth, 150);
          yPos = imageAdded ? margin + 160 : margin + 20;
          
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
          const quoteLines = pdf.splitTextToSize(`"${page.content || ''}"`, contentWidth - 20);
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
            const imageAdded = await addImageSafe(page.imageUrl, margin, yPos, contentWidth, 80);
            if (imageAdded) yPos += 90;
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
        <div className="h-full relative overflow-hidden">
          {/* Full-bleed background image */}
          {page.imageUrl ? (
            <img 
              src={page.imageUrl} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-accent/20 to-background" />
          )}
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
          
          {/* Content overlay */}
          <div className="relative h-full flex flex-col items-center justify-end text-center p-4 sm:p-8 pb-12 sm:pb-16">
            {isEditing ? (
              <div className="w-full max-w-md space-y-3 mb-4">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="font-serif text-xl sm:text-2xl text-center bg-white/90"
                  placeholder={t('vault.book.titlePlaceholder')}
                />
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="text-center bg-white/90"
                  placeholder={t('vault.book.subtitlePlaceholder')}
                />
                <div className="flex justify-center gap-2">
                  <Button size="sm" onClick={() => {
                    const newPages = [...pages];
                    newPages[index] = { ...newPages[index], title: editTitle, subtitle: editContent };
                    setPages(newPages);
                    setEditingPage(null);
                  }}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 text-white drop-shadow-lg">
                  {page.title}
                </h1>
                {page.subtitle && (
                  <p className="text-white/90 text-sm sm:text-lg drop-shadow-md mb-4">{page.subtitle}</p>
                )}
                <div className="flex items-center gap-2 text-white/80 mb-4">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-xs sm:text-sm font-medium">{t('vault.book.memoryBook')}</span>
                </div>
              </>
            )}
          </div>
          
          {/* Edit controls at top */}
          {!isEditing && (
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                size="sm"
                variant="secondary"
                className="shadow-md bg-white/90 hover:bg-white"
                onClick={() => coverFileInputRef.current?.click()}
              >
                <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="text-xs">{t('vault.book.uploadImage')}</span>
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="shadow-md bg-white/90 hover:bg-white"
                onClick={() => {
                  setEditTitle(page.title || '');
                  setEditContent(page.subtitle || '');
                  setEditingPage(index);
                }}
              >
                <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (page.type === 'image') {
      return (
        <div className="h-full flex flex-col items-center justify-center p-4 sm:p-8 relative">
          {page.imageUrl ? (
            <>
              <div 
                className="w-full max-w-md rounded-xl overflow-hidden shadow-lg mb-4 cursor-pointer relative group"
                onClick={() => {
                  setEditingImagePageIndex(index);
                  imagePageFileInputRef.current?.click();
                }}
              >
                <img src={page.imageUrl} alt="" className="w-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-sm font-medium flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    {t('vault.book.changeImage')}
                  </div>
                </div>
              </div>
              {isEditing ? (
                <div className="w-full max-w-md space-y-2">
                  <Input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder={t('vault.book.imageCaptionPlaceholder')}
                    className="text-center"
                  />
                  <div className="flex justify-center gap-2">
                    <Button size="sm" onClick={() => {
                      const newPages = [...pages];
                      newPages[index] = { ...newPages[index], title: editContent };
                      setPages(newPages);
                      setEditingPage(null);
                    }}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic text-center">{page.title}</p>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingImagePageIndex(index);
                    imagePageFileInputRef.current?.click();
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {t('vault.book.uploadImage')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generatePageImage(index)}
                  disabled={isGeneratingPageImage}
                >
                  {isGeneratingPageImage ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ImageIcon className="h-4 w-4 mr-2" />
                  )}
                  {t('vault.generateImage')}
                </Button>
              </div>
            </div>
          )}
          {/* Edit/Delete buttons for image pages */}
          <div className="absolute top-2 right-2 flex gap-1">
            <Button variant="ghost" size="sm" onClick={() => {
              setEditContent(page.title || '');
              setEditingPage(index);
            }}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deletePage(index)} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    if (page.type === 'quote') {
      return (
        <div className="h-full flex flex-col items-center justify-center p-4 sm:p-8 text-center bg-accent/5">
          <div className="max-w-lg">
            <p className="font-serif text-xl sm:text-2xl md:text-3xl italic text-foreground/80 leading-relaxed">
              "{isEditing ? (
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="text-xl sm:text-2xl font-serif italic text-center min-h-[150px]"
                />
              ) : page.content}"
            </p>
          </div>
        </div>
      );
    }

    if (page.type === 'ending') {
      return (
        <div className="h-full flex flex-col items-center justify-center p-4 sm:p-8 text-center bg-gradient-to-t from-accent/5 to-background">
          <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-accent mb-4 sm:mb-6" />
          <h2 className="font-serif text-xl sm:text-2xl mb-3 sm:mb-4 text-foreground">{page.title}</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md">{page.content}</p>
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
      <DialogContent className="max-w-4xl h-[90vh] sm:h-[90vh] flex flex-col p-0 gap-0">
        {/* Hidden file inputs */}
        <input
          type="file"
          ref={coverFileInputRef}
          onChange={handleCoverImageUpload}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInsertImagePage}
          accept="image/*"
          className="hidden"
        />
        <input
          type="file"
          ref={imagePageFileInputRef}
          onChange={handleReplacePageImage}
          accept="image/*"
          className="hidden"
        />
        
        <DialogHeader className="p-2 sm:p-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
              <span className="truncate">{t('vault.book.title')}</span>
              {hasUnsavedChanges && <span className="text-xs text-muted-foreground">*</span>}
            </DialogTitle>
            <div className="flex items-center gap-1 flex-wrap justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isGenerating || pages.length === 0}
                className="px-2"
              >
                <ImagePlus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={addContextInfo}
                disabled={isAddingContext || isGenerating}
                className="px-2 sm:px-3 text-xs"
              >
                {isAddingContext ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span>+ {t('vault.book.addContext')}</span>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={generateBook}
                disabled={isGenerating}
                className="px-2"
                title={t('vault.book.regenerate')}
              >
                <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
              </Button>
              <Button
                variant={hasUnsavedChanges ? "default" : "outline"}
                size="sm"
                onClick={saveBook}
                disabled={isSaving || isGenerating || pages.length === 0}
                className="px-2 sm:px-3 text-xs"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">{t('vault.book.saveBook')}</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToPDF}
                disabled={isExporting || isGenerating || pages.length === 0}
                className="px-2"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
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
              <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-accent mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground">{t('vault.book.generating')}</p>
            </div>
          ) : pages.length > 0 ? (
            <div className="h-full">
              {/* Page Display */}
              <div className="h-full bg-background rounded-lg shadow-lg mx-2 sm:mx-4 my-2 sm:my-4 overflow-hidden">
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
          <div className="p-2 sm:p-4 border-t border-border shrink-0 flex items-center justify-between bg-background">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-2 sm:px-3"
            >
              <ChevronLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{t('vault.book.previous')}</span>
            </Button>
            
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-[50%] sm:max-w-none">
              {pages.length <= 10 ? (
                pages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all shrink-0",
                      idx === currentPage 
                        ? "bg-accent w-3 sm:w-4" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                  />
                ))
              ) : null}
              <span className="ml-2 sm:ml-4 text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                {currentPage + 1} / {pages.length}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(pages.length - 1, p + 1))}
              disabled={currentPage === pages.length - 1}
              className="px-2 sm:px-3"
            >
              <span className="hidden sm:inline">{t('vault.book.next')}</span>
              <ChevronRight className="h-4 w-4 sm:ml-2" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MemoryBook;
