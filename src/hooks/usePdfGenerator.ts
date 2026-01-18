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

// Wrap text to fit within a specified width
const wrapText = (text: string, maxWidth: number, doc: jsPDF): string[] => {
  const words = sanitizeText(text).split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = doc.getTextWidth(testLine);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

export const usePdfGenerator = () => {
  const generatePdf = async (summary: SummaryData, coverImageData?: string | null): Promise<void> => {
    // A4 format in mm
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 25;
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
      doc.addPage();
      // Subtle border line
      doc.setDrawColor(colors.accent);
      doc.setLineWidth(0.5);
      doc.line(margin - 5, 20, margin - 5, pageHeight - 20);
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
      return y + 10;
    };

    // ===== PAGE 1: COVER PAGE =====
    // Background accent strip
    doc.setFillColor(colors.accent);
    doc.rect(0, 0, 8, pageHeight, 'F');

    // Cover image or decorative element
    if (coverImageData) {
      try {
        // Add image as main visual element
        const imgWidth = 120;
        const imgHeight = 90;
        const imgX = (pageWidth - imgWidth) / 2;
        const imgY = 50;
        
        doc.addImage(coverImageData, 'JPEG', imgX, imgY, imgWidth, imgHeight);
        
        // Add subtle frame
        doc.setDrawColor(colors.accent);
        doc.setLineWidth(1);
        doc.rect(imgX - 2, imgY - 2, imgWidth + 4, imgHeight + 4);
      } catch (error) {
        console.error('Error adding cover image:', error);
      }
    } else {
      // Decorative geometric element when no image
      doc.setFillColor(colors.light);
      doc.circle(pageWidth / 2, 100, 40, 'F');
      doc.setDrawColor(colors.accent);
      doc.setLineWidth(1);
      doc.circle(pageWidth / 2, 100, 42);
      doc.circle(pageWidth / 2, 100, 35);
    }

    // Title section
    const titleY = coverImageData ? 165 : 170;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(colors.primary);
    
    const titleLines = wrapText(summary.title, contentWidth, doc);
    titleLines.forEach((line, i) => {
      doc.text(line, pageWidth / 2, titleY + i * 12, { align: 'center' });
    });

    // Reflection type badge
    const typeY = titleY + titleLines.length * 12 + 15;
    doc.setFontSize(10);
    doc.setTextColor(colors.accent);
    const typeLabel = summary.memory_type === 'impulse-reflection' ? 'Impuls-Reflexion' :
                      summary.memory_type === 'situation-reflection' ? 'Situations-Reflexion' :
                      'Selfcare-Reflexion';
    doc.text(typeLabel.toUpperCase(), pageWidth / 2, typeY, { align: 'center' });

    // Date and location
    const metaY = typeY + 15;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(colors.secondary);
    const dateStr = format(new Date(summary.created_at), 'dd. MMMM yyyy', { locale: de });
    doc.text(dateStr, pageWidth / 2, metaY, { align: 'center' });
    
    if (summary.location) {
      doc.text(sanitizeText(summary.location), pageWidth / 2, metaY + 7, { align: 'center' });
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

    // Summary text
    if (structured.summary_text) {
      y = drawSectionHeader('Zusammenfassung', y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(colors.text);
      const summaryLines = wrapText(structured.summary_text, contentWidth, doc);
      summaryLines.forEach(line => {
        if (y > pageHeight - 40) {
          addStyledPage();
          y = 35;
        }
        doc.text(line, margin, y);
        y += 5;
      });
      y += 10;
    }

    // Patterns
    if (structured.patterns?.length > 0) {
      if (y > pageHeight - 60) { addStyledPage(); y = 35; }
      y = drawSectionHeader('Erkannte Muster', y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(colors.text);
      
      structured.patterns.forEach(pattern => {
        const patternLines = wrapText(`• ${pattern}`, contentWidth - 5, doc);
        patternLines.forEach((line, i) => {
          if (y > pageHeight - 25) { addStyledPage(); y = 35; }
          doc.text(line, i === 0 ? margin : margin + 5, y);
          y += 5;
        });
        y += 2;
      });
      y += 8;
    }

    // Needs
    if (structured.needs?.length > 0) {
      if (y > pageHeight - 50) { addStyledPage(); y = 35; }
      y = drawSectionHeader('Beruehrte Beduerfnisse', y);
      doc.setFontSize(10);
      
      const needsPerRow = 3;
      let needX = margin;
      let needCount = 0;
      
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
        needCount++;
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
          const typeWidth = doc.getTextWidth(typeText) + 8;
          doc.roundedRect(margin, y - 4, typeWidth, 7, 1.5, 1.5, 'F');
          doc.setTextColor('#3F51B5');
          doc.setFont('helvetica', 'bold');
          doc.text(sanitizeText(typeText), margin + 4, y);
          
          // Name and description
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(colors.text);
          doc.text(sanitizeText(part.name) + ':', margin + typeWidth + 5, y);
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(colors.secondary);
          const descLines = wrapText(part.description, contentWidth - typeWidth - 10, doc);
          descLines.forEach((line, i) => {
            if (y > pageHeight - 25) { addStyledPage(); y = 35; }
            if (i === 0) {
              doc.text(line, margin + typeWidth + doc.getTextWidth(sanitizeText(part.name) + ':') + 8, y);
            } else {
              y += 5;
              doc.text(line, margin + 5, y);
            }
          });
          y += 10;
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
            if (i === 0) {
              doc.text(line, margin + doc.getTextWidth(sanitizeText(area.area) + ':') + 3, y);
            } else {
              y += 5;
              doc.text(line, margin + 5, y);
            }
          });
          y += 8;
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
            doc.text(line, j === 0 ? margin : margin + 5, y);
            y += 5;
          });
          y += 3;
        });
        y += 10;
      }

      // Recommendations
      if (structured.recommendations) {
        if (y > pageHeight - 80) { addStyledPage(); y = 35; }
        y = drawSectionHeader('Empfehlungen', y);
        
        // Box background
        doc.setFillColor(colors.light);
        const boxHeight = 60;
        doc.roundedRect(margin, y - 3, contentWidth, boxHeight, 3, 3, 'F');
        
        y += 5;
        doc.setFontSize(10);

        if (structured.recommendations.body_exercise) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(colors.accent);
          doc.text('Koerperuebung:', margin + 5, y);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(colors.text);
          const exLines = wrapText(structured.recommendations.body_exercise, contentWidth - 15, doc);
          exLines.forEach(line => {
            y += 5;
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
            y += 5;
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
            y += 5;
            doc.text(line, margin + 5, y);
          });
        }
      }
    }

    // Save PDF
    const fileName = `${summary.title.replace(/[^a-z0-9äöüß]/gi, '_')}_Reflexion.pdf`;
    doc.save(fileName);
  };

  return { generatePdf };
};
