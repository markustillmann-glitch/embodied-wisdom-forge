import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface StructuredSummary {
  patterns: string[];
  needs: string[];
  parts: Array<{ name: string; type: string; description: string }>;
  body_areas: Array<{ area: string; significance: string }>;
  insights: string[];
  recommendations: {
    body_exercise: string;
    micro_action: string;
    reflection_question: string;
  };
  summary_text: string;
}

interface SummaryData {
  title: string;
  created_at: string;
  location?: string | null;
  memory_type: string;
  structured_summary: StructuredSummary | null;
  image_url?: string | null;
  content?: string;
}

// Sanitize text for PDF (handle special characters)
const sanitizeText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2026/g, '...')
    .replace(/\u2013/g, '-')
    .replace(/\u2014/g, '--')
    .replace(/\u00A0/g, ' ');
};

// Calculate line height based on font size (typically 1.2-1.5x font size for good readability)
const getLineHeight = (fontSize: number): number => {
  // Convert font size from pt to mm and apply line height factor
  // 1pt = 0.352778mm, line height factor of 1.4 for readability
  return (fontSize * 0.352778) * 1.4;
};

// Wrap text to fit within a specified width - uses current font settings of doc
const wrapText = (text: string, maxWidth: number, doc: jsPDF): string[] => {
  const sanitized = sanitizeText(text);
  if (!sanitized) return [];
  
  // Handle explicit line breaks first
  const paragraphs = sanitized.split('\n');
  const allLines: string[] = [];
  
  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      allLines.push(''); // Preserve empty lines for paragraph breaks
      continue;
    }
    
    const words = paragraph.split(' ').filter(w => w.length > 0);
    let currentLine = '';

    for (const word of words) {
      // Handle very long words that might exceed maxWidth on their own
      if (doc.getTextWidth(word) > maxWidth) {
        // Push current line if exists
        if (currentLine) {
          allLines.push(currentLine);
          currentLine = '';
        }
        // Break the long word into smaller chunks
        let remainingWord = word;
        while (remainingWord.length > 0) {
          let charCount = remainingWord.length;
          while (charCount > 0 && doc.getTextWidth(remainingWord.substring(0, charCount)) > maxWidth) {
            charCount--;
          }
          if (charCount === 0) charCount = 1; // At minimum, take one character
          allLines.push(remainingWord.substring(0, charCount));
          remainingWord = remainingWord.substring(charCount);
        }
        continue;
      }
      
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = doc.getTextWidth(testLine);

      if (testWidth > maxWidth && currentLine) {
        allLines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      allLines.push(currentLine);
    }
  }

  return allLines;
};

// Helper to add text with proper line wrapping and returns new Y position
const addWrappedText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  pageHeight: number,
  addNewPage: () => void,
  margin: number = 35
): number => {
  const lineHeight = getLineHeight(fontSize);
  const lines = wrapText(text, maxWidth, doc);
  
  for (const line of lines) {
    if (y > pageHeight - 25) {
      addNewPage();
      y = margin;
    }
    doc.text(line, x, y);
    y += lineHeight;
  }
  
  return y;
};

export const usePdfGenerator = () => {
  const generatePdf = async (summary: SummaryData, coverImageData?: string | null): Promise<void> => {
    // Square format 210x210mm
    const pageSize = 210;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pageSize, pageSize],
    });

    const pageWidth = pageSize;
    const pageHeight = pageSize;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Color palette - warm, elegant
    const colors = {
      primary: '#2D3436',
      secondary: '#636E72',
      accent: '#B8860B',
      light: '#F5F5DC',
      text: '#1A1A1A',
      muted: '#6B7280',
    };

    const structured = summary.structured_summary;

    // Helper function to add a new page with consistent styling
    const addStyledPage = () => {
      doc.addPage([pageSize, pageSize]);
      // Subtle border line
      doc.setDrawColor(colors.accent);
      doc.setLineWidth(0.5);
      doc.line(margin - 5, 15, margin - 5, pageHeight - 15);
    };

    // Helper to draw section header
    const drawSectionHeader = (title: string, y: number, icon?: string): number => {
      doc.setFontSize(11);
      doc.setTextColor(colors.accent);
      doc.setFont('helvetica', 'bold');
      const headerText = icon ? `${icon}  ${sanitizeText(title)}` : sanitizeText(title);
      doc.text(headerText, margin, y);
      doc.setDrawColor(colors.accent);
      doc.setLineWidth(0.3);
      doc.line(margin, y + 2, margin + 40, y + 2);
      return y + getLineHeight(11) + 4;
    };

    // ===== PAGE 1: COVER PAGE =====
    // Cover image with preserved aspect ratio
    let contentStartY = 20;
    
    if (coverImageData) {
      try {
        // Create temporary image to get natural dimensions
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error('Failed to load image'));
          img.src = coverImageData;
        });
        
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;
        const aspectRatio = naturalWidth / naturalHeight;
        
        // Calculate dimensions that fit within page while preserving aspect ratio
        const maxImgWidth = pageWidth - 20; // Leave some margin
        const maxImgHeight = pageHeight * 0.5; // Max 50% of page height
        
        let imgWidth: number;
        let imgHeight: number;
        
        if (maxImgWidth / aspectRatio <= maxImgHeight) {
          // Width is the limiting factor
          imgWidth = maxImgWidth;
          imgHeight = maxImgWidth / aspectRatio;
        } else {
          // Height is the limiting factor
          imgHeight = maxImgHeight;
          imgWidth = maxImgHeight * aspectRatio;
        }
        
        // Center the image horizontally
        const imgX = (pageWidth - imgWidth) / 2;
        const imgY = 10;
        
        doc.addImage(coverImageData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
        
        // Accent line at bottom of image
        doc.setFillColor(colors.accent);
        doc.rect(imgX, imgY + imgHeight + 2, imgWidth, 1.5, 'F');
        
        contentStartY = imgY + imgHeight + 15;
      } catch (error) {
        console.error('Error adding cover image:', error);
        // Fallback decorative element
        doc.setFillColor(colors.light);
        doc.circle(pageWidth / 2, 60, 30, 'F');
        doc.setDrawColor(colors.accent);
        doc.setLineWidth(1);
        doc.circle(pageWidth / 2, 60, 32);
        contentStartY = 100;
      }
    } else {
      // Decorative geometric element when no image
      doc.setFillColor(colors.accent);
      doc.rect(0, 0, 8, pageHeight, 'F');
      doc.setFillColor(colors.light);
      doc.circle(pageWidth / 2, 60, 30, 'F');
      doc.setDrawColor(colors.accent);
      doc.setLineWidth(1);
      doc.circle(pageWidth / 2, 60, 32);
      doc.circle(pageWidth / 2, 60, 25);
      contentStartY = 100;
    }

    // Title section - positioned based on image presence
    const titleY = contentStartY + 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(colors.primary);
    
    const titleLineHeight = getLineHeight(20);
    const titleLines = wrapText(summary.title, contentWidth, doc);
    titleLines.forEach((line, i) => {
      doc.text(line, pageWidth / 2, titleY + i * titleLineHeight, { align: 'center' });
    });

    // Reflection type badge
    const typeY = titleY + titleLines.length * titleLineHeight + 8;
    doc.setFontSize(9);
    doc.setTextColor(colors.accent);
    const typeLabel = summary.memory_type === 'impulse-reflection' ? 'Impuls-Reflexion' :
                      summary.memory_type === 'situation-reflection' ? 'Situations-Reflexion' :
                      'Selfcare-Reflexion';
    doc.text(typeLabel.toUpperCase(), pageWidth / 2, typeY, { align: 'center' });

    // Date and location
    const metaY = typeY + 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(colors.secondary);
    const dateStr = format(new Date(summary.created_at), 'dd. MMMM yyyy', { locale: de });
    doc.text(dateStr, pageWidth / 2, metaY, { align: 'center' });
    
    if (summary.location) {
      doc.text(sanitizeText(summary.location), pageWidth / 2, metaY + 6, { align: 'center' });
    }

    // Footer decoration
    doc.setDrawColor(colors.accent);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
    doc.setFontSize(8);
    doc.setTextColor(colors.muted);
    doc.text('Reflexions-Tagebuch', pageWidth / 2, pageHeight - 20, { align: 'center' });

    if (!structured) {
      doc.save(`${summary.title.replace(/[^a-z0-9äöüß]/gi, '_')}_Reflexion.pdf`);
      return;
    }

    // ===== PAGE 2: ZUSAMMENFASSUNG & MUSTER & BEDÜRFNISSE =====
    addStyledPage();
    let y = 35;
    const bodyFontSize = 10;
    const bodyLineHeight = getLineHeight(bodyFontSize);

    // Summary text
    if (structured.summary_text) {
      y = drawSectionHeader('Zusammenfassung', y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(bodyFontSize);
      doc.setTextColor(colors.text);
      y = addWrappedText(doc, structured.summary_text, margin, y, contentWidth, bodyFontSize, pageHeight, addStyledPage, 35);
      y += 10;
    }

    // Patterns
    if (structured.patterns?.length > 0) {
      if (y > pageHeight - 60) { addStyledPage(); y = 35; }
      y = drawSectionHeader('Erkannte Muster', y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(bodyFontSize);
      doc.setTextColor(colors.text);
      
      structured.patterns.forEach(pattern => {
        const patternLines = wrapText(`• ${pattern}`, contentWidth - 5, doc);
        patternLines.forEach((line, i) => {
          if (y > pageHeight - 25) { addStyledPage(); y = 35; }
          doc.text(line, i === 0 ? margin : margin + 5, y);
          y += bodyLineHeight;
        });
        y += 2;
      });
      y += 8;
    }

    // Needs
    if (structured.needs?.length > 0) {
      if (y > pageHeight - 50) { addStyledPage(); y = 35; }
      y = drawSectionHeader('Beruehrte Beduerfnisse', y);
      doc.setFontSize(bodyFontSize);
      
      let needX = margin;
      
      structured.needs.forEach(need => {
        const needText = sanitizeText(need);
        const needWidth = doc.getTextWidth(needText) + 10;
        
        if (needX + needWidth > pageWidth - margin) {
          needX = margin;
          y += 10;
        }
        if (y > pageHeight - 25) { addStyledPage(); y = 35; needX = margin; }
        
        // Draw need badge
        doc.setFillColor('#FCE4EC');
        doc.roundedRect(needX, y - 5, needWidth, 8, 2, 2, 'F');
        doc.setTextColor('#C2185B');
        doc.text(needText, needX + 5, y);
        
        needX += needWidth + 5;
      });
      y += 15;
    }

    // ===== PAGE 3: INNERE TEILE & KÖRPERBEREICHE =====
    if (structured.parts?.length > 0 || structured.body_areas?.length > 0) {
      addStyledPage();
      y = 35;

      // Parts
      if (structured.parts?.length > 0) {
        y = drawSectionHeader('Innere Anteile', y);
        doc.setFontSize(10);
        
        const partTypeLabels: Record<string, string> = {
          manager: 'Manager',
          firefighter: 'Feuerwehr',
          exile: 'Exilant',
          self: 'Selbst',
        };

        structured.parts.forEach(part => {
          if (y > pageHeight - 30) { addStyledPage(); y = 35; }
          
          // Type badge
          doc.setFillColor('#E8EAF6');
          const typeText = partTypeLabels[part.type] || part.type;
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(bodyFontSize);
          const typeWidth = doc.getTextWidth(typeText) + 8;
          doc.roundedRect(margin, y - 4, typeWidth, 7, 1.5, 1.5, 'F');
          doc.setTextColor('#3F51B5');
          doc.text(sanitizeText(typeText), margin + 4, y);
          
          // Name
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(colors.text);
          const nameText = sanitizeText(part.name) + ':';
          const nameX = margin + typeWidth + 5;
          doc.text(nameText, nameX, y);
          
          // Description - calculate available width for first line vs continuation lines
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(colors.secondary);
          const nameWidth = doc.getTextWidth(nameText);
          const firstLineX = nameX + nameWidth + 3;
          const firstLineWidth = pageWidth - margin - firstLineX;
          const continuationWidth = contentWidth - 5;
          
          // Wrap description text properly
          const descText = sanitizeText(part.description);
          const words = descText.split(' ').filter(w => w.length > 0);
          const descLines: string[] = [];
          let currentLine = '';
          let isFirstLine = true;
          
          for (const word of words) {
            const maxWidth = isFirstLine ? firstLineWidth : continuationWidth;
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            
            if (doc.getTextWidth(testLine) > maxWidth && currentLine) {
              descLines.push(currentLine);
              currentLine = word;
              isFirstLine = false;
            } else {
              currentLine = testLine;
            }
          }
          if (currentLine) {
            descLines.push(currentLine);
          }
          
          // Draw description lines
          descLines.forEach((line, i) => {
            if (y > pageHeight - 25) { addStyledPage(); y = 35; }
            if (i === 0) {
              doc.text(line, firstLineX, y);
            } else {
              y += bodyLineHeight;
              doc.text(line, margin + 5, y);
            }
          });
          y += bodyLineHeight + 6;
        });
        y += 5;
      }

      // Body areas
      if (structured.body_areas?.length > 0) {
        if (y > pageHeight - 50) { addStyledPage(); y = 35; }
        y = drawSectionHeader('Koerperbereiche', y);
        doc.setFontSize(10);

        structured.body_areas.forEach(area => {
          if (y > pageHeight - 25) { addStyledPage(); y = 35; }
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(colors.text);
          doc.text(sanitizeText(area.area) + ':', margin, y);
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(colors.secondary);
          const sigLines = wrapText(area.significance, contentWidth - 25, doc);
          sigLines.forEach((line, i) => {
            if (y > pageHeight - 25) { addStyledPage(); y = 35; }
            if (i === 0) {
              doc.text(line, margin + doc.getTextWidth(sanitizeText(area.area) + ':') + 3, y);
            } else {
              y += bodyLineHeight;
              doc.text(line, margin + 5, y);
            }
          });
          y += bodyLineHeight + 2;
        });
      }
    }

    // ===== PAGE 4: ERKENNTNISSE & EMPFEHLUNGEN =====
    if (structured.insights?.length > 0 || structured.recommendations) {
      addStyledPage();
      y = 35;

      // Insights
      if (structured.insights?.length > 0) {
        y = drawSectionHeader('Zentrale Erkenntnisse', y);
        doc.setFontSize(10);
        doc.setTextColor(colors.text);

        structured.insights.forEach((insight, i) => {
          if (y > pageHeight - 25) { addStyledPage(); y = 35; }
          doc.setFont('helvetica', 'normal');
          const insightLines = wrapText(`${i + 1}. ${insight}`, contentWidth - 5, doc);
          insightLines.forEach((line, j) => {
            if (y > pageHeight - 25) { addStyledPage(); y = 35; }
            doc.text(line, j === 0 ? margin : margin + 5, y);
            y += bodyLineHeight;
          });
          y += 3;
        });
        y += 10;
      }

      // Recommendations
      if (structured.recommendations) {
        if (y > pageHeight - 80) { addStyledPage(); y = 35; }
        y = drawSectionHeader('Empfehlungen', y);
        
        // Calculate dynamic box height based on content
        doc.setFontSize(bodyFontSize);
        let tempY = 0;
        const recLineHeight = bodyLineHeight;
        
        if (structured.recommendations.body_exercise) {
          tempY += recLineHeight; // Label
          tempY += wrapText(structured.recommendations.body_exercise, contentWidth - 15, doc).length * recLineHeight;
          tempY += 8;
        }
        if (structured.recommendations.micro_action) {
          tempY += recLineHeight;
          tempY += wrapText(structured.recommendations.micro_action, contentWidth - 15, doc).length * recLineHeight;
          tempY += 8;
        }
        if (structured.recommendations.reflection_question) {
          tempY += recLineHeight;
          tempY += wrapText(`"${structured.recommendations.reflection_question}"`, contentWidth - 15, doc).length * recLineHeight;
        }
        
        // Box background with dynamic height
        doc.setFillColor(colors.light);
        const boxHeight = Math.max(60, tempY + 10);
        doc.roundedRect(margin, y - 3, contentWidth, boxHeight, 3, 3, 'F');
        
        y += 5;

        if (structured.recommendations.body_exercise) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(colors.accent);
          doc.text('Koerperuebung:', margin + 5, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(colors.text);
          const exLines = wrapText(structured.recommendations.body_exercise, contentWidth - 15, doc);
          exLines.forEach(line => {
            y += recLineHeight;
            doc.text(line, margin + 5, y);
          });
          y += 8;
        }

        if (structured.recommendations.micro_action) {
          if (y > pageHeight - 25) { addStyledPage(); y = 35; }
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(colors.accent);
          doc.text('Mikro-Aktion:', margin + 5, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(colors.text);
          const actionLines = wrapText(structured.recommendations.micro_action, contentWidth - 15, doc);
          actionLines.forEach(line => {
            y += recLineHeight;
            doc.text(line, margin + 5, y);
          });
          y += 8;
        }

        if (structured.recommendations.reflection_question) {
          if (y > pageHeight - 25) { addStyledPage(); y = 35; }
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(colors.accent);
          doc.text('Zum Nachdenken:', margin + 5, y);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(colors.text);
          const qLines = wrapText(`"${structured.recommendations.reflection_question}"`, contentWidth - 15, doc);
          qLines.forEach(line => {
            y += recLineHeight;
            doc.text(line, margin + 5, y);
          });
        }
      }
    }

    // Save PDF
    const fileName = `${summary.title.replace(/[^a-z0-9äöüß]/gi, '_')}_Reflexion.pdf`;
    doc.save(fileName);
  };

  const generateConversationPdf = async (summary: SummaryData): Promise<void> => {
    // Standard A4 format
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Color palette
    const colors = {
      primary: '#2D3436',
      secondary: '#636E72',
      accent: '#B8860B',
      userBg: '#E3F2FD',
      userText: '#1565C0',
      botBg: '#F3E5F5',
      botText: '#7B1FA2',
      text: '#1A1A1A',
      muted: '#6B7280',
    };

    const bodyFontSize = 10;
    const lineHeight = getLineHeight(bodyFontSize);

    // Helper function to add a new page
    const addNewPage = () => {
      doc.addPage();
    };

    // ===== COVER PAGE =====
    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(colors.primary);
    
    const titleLines = wrapText(summary.title, contentWidth, doc);
    let y = 40;
    titleLines.forEach((line, i) => {
      doc.text(line, pageWidth / 2, y + i * getLineHeight(20), { align: 'center' });
    });

    y = 40 + titleLines.length * getLineHeight(20) + 10;

    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(colors.secondary);
    doc.setFont('helvetica', 'normal');
    doc.text('Vollstaendige Unterhaltung', pageWidth / 2, y, { align: 'center' });
    y += 15;

    // Date and type
    doc.setFontSize(10);
    doc.setTextColor(colors.muted);
    const dateStr = format(new Date(summary.created_at), 'dd. MMMM yyyy, HH:mm', { locale: de }) + ' Uhr';
    doc.text(dateStr, pageWidth / 2, y, { align: 'center' });
    y += 6;
    
    const typeLabel = summary.memory_type === 'impulse-reflection' ? 'Impuls-Reflexion' :
                      summary.memory_type === 'situation-reflection' ? 'Situations-Reflexion' :
                      'Selfcare-Reflexion';
    doc.text(typeLabel, pageWidth / 2, y, { align: 'center' });
    
    if (summary.location) {
      y += 6;
      doc.text(sanitizeText(summary.location), pageWidth / 2, y, { align: 'center' });
    }

    // Decorative line
    y += 15;
    doc.setDrawColor(colors.accent);
    doc.setLineWidth(0.5);
    doc.line(margin + 40, y, pageWidth - margin - 40, y);

    // Legend
    y += 15;
    doc.setFontSize(9);
    doc.setTextColor(colors.muted);
    doc.text('Legende:', margin, y);
    y += 6;
    
    // User legend
    doc.setFillColor(colors.userBg);
    doc.roundedRect(margin, y - 3, 8, 5, 1, 1, 'F');
    doc.setTextColor(colors.userText);
    doc.text('Du (Nutzer)', margin + 12, y);
    
    // Bot legend
    doc.setFillColor(colors.botBg);
    doc.roundedRect(margin + 50, y - 3, 8, 5, 1, 1, 'F');
    doc.setTextColor(colors.botText);
    doc.text('Oria (Coach)', margin + 62, y);

    // Start conversation on new page
    doc.addPage();
    y = margin;

    // Parse and render conversation
    const content = summary.content || '';
    const blocks = content.split(/\n\n+/);

    for (const block of blocks) {
      const trimmedBlock = block.trim();
      if (!trimmedBlock) continue;

      const isOria = trimmedBlock.startsWith('Oria:');
      const isUser = trimmedBlock.startsWith('Du:');
      
      let message = trimmedBlock;
      let speaker = '';
      let bgColor = '#FFFFFF';
      let textColor = colors.text;
      let labelColor = colors.muted;

      if (isOria) {
        message = trimmedBlock.replace(/^Oria:\s*/, '');
        speaker = 'Oria (Coach)';
        bgColor = colors.botBg;
        labelColor = colors.botText;
      } else if (isUser) {
        message = trimmedBlock.replace(/^Du:\s*/, '');
        speaker = 'Du';
        bgColor = colors.userBg;
        labelColor = colors.userText;
      }

      // IMPORTANT: Set font size BEFORE calculating text width for proper line wrapping
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(bodyFontSize);
      
      // Calculate message lines with correct font settings
      const messageLines = wrapText(sanitizeText(message), contentWidth - 14, doc);
      const messageHeight = messageLines.length * lineHeight + 14;

      // Check if we need a new page (including speaker label height)
      const totalHeight = messageHeight + (speaker ? 10 : 0);
      if (y + totalHeight > pageHeight - margin) {
        addNewPage();
        y = margin;
      }

      // Draw speaker label
      if (speaker) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(labelColor);
        doc.text(speaker, margin + 5, y + 4);
        y += 10;
      }

      // Draw message background
      doc.setFillColor(bgColor);
      doc.roundedRect(margin, y, contentWidth, messageHeight, 3, 3, 'F');

      // Draw message text - reset font to body size
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(bodyFontSize);
      doc.setTextColor(textColor);
      
      let textY = y + 7;
      for (const line of messageLines) {
        // Check if we need a page break mid-message
        if (textY > pageHeight - margin - 5) {
          addNewPage();
          y = margin;
          textY = y + 7;
          // Redraw background for continuation
          const remainingLines = messageLines.slice(messageLines.indexOf(line));
          const remainingHeight = remainingLines.length * lineHeight + 10;
          doc.setFillColor(bgColor);
          doc.roundedRect(margin, y, contentWidth, remainingHeight, 3, 3, 'F');
          doc.setTextColor(textColor);
        }
        doc.text(line, margin + 7, textY);
        textY += lineHeight;
      }

      y += messageHeight + 6;
    }

    // Footer on last page
    doc.setFontSize(8);
    doc.setTextColor(colors.muted);
    doc.text('Reflexions-Tagebuch - Erstellt am ' + format(new Date(), 'dd.MM.yyyy', { locale: de }), 
             pageWidth / 2, pageHeight - 15, { align: 'center' });

    // Save PDF
    const fileName = `${summary.title.replace(/[^a-z0-9äöüß]/gi, '_')}_Unterhaltung.pdf`;
    doc.save(fileName);
  };

  return { generatePdf, generateConversationPdf };
};
