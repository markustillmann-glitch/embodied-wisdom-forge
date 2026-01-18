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

interface SummaryMemory {
  id: string;
  title: string;
  summary: string | null;
  structured_summary: StructuredSummary | null;
  location: string | null;
  created_at: string;
  memory_date: string | null;
  memory_type: string;
}

// Editorial color palette - sophisticated monochrome with warm accent
const colors = {
  black: [20, 20, 20] as [number, number, number],
  darkGray: [45, 45, 45] as [number, number, number],
  mediumGray: [100, 100, 100] as [number, number, number],
  lightGray: [180, 180, 180] as [number, number, number],
  paleGray: [240, 240, 238] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  accent: [180, 100, 70] as [number, number, number], // Warm terracotta accent
};

// Replace special characters for PDF compatibility
const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae')
    .replace(/Ö/g, 'Oe')
    .replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss')
    .replace(/„/g, '"')
    .replace(/"/g, '"')
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/'/g, "'")
    .replace(/'/g, "'")
    .replace(/…/g, '...');
};

export const usePdfGenerator = () => {
  const generatePdf = async (
    summary: SummaryMemory,
    coverImage: string | null
  ): Promise<void> => {
    // Square format: 180mm x 180mm
    const pageSize = 180;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pageSize, pageSize],
    });

    const pageWidth = pageSize;
    const pageHeight = pageSize;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    // Helper: Add new page
    const addPage = () => {
      pdf.addPage();
    };

    // Helper: Add text with options
    const addText = (
      text: string,
      x: number,
      y: number,
      options: {
        fontSize?: number;
        color?: [number, number, number];
        fontStyle?: 'normal' | 'bold' | 'italic';
        maxWidth?: number;
        align?: 'left' | 'center' | 'right';
        lineHeight?: number;
      } = {}
    ): number => {
      const {
        fontSize = 10,
        color = colors.darkGray,
        fontStyle = 'normal',
        maxWidth = contentWidth,
        align = 'left',
        lineHeight = 1.5,
      } = options;

      pdf.setFontSize(fontSize);
      pdf.setTextColor(...color);
      pdf.setFont('helvetica', fontStyle);

      const sanitized = sanitizeText(text);
      const lines = pdf.splitTextToSize(sanitized, maxWidth);
      const lineHeightMm = fontSize * 0.35 * lineHeight;

      lines.forEach((line: string, index: number) => {
        let xPos = x;
        if (align === 'center') {
          xPos = pageWidth / 2;
        } else if (align === 'right') {
          xPos = pageWidth - margin;
        }
        pdf.text(line, xPos, y + index * lineHeightMm, { align });
      });

      return y + lines.length * lineHeightMm;
    };

    // ===== PAGE 1: TITLE PAGE =====
    // Full page warm background
    pdf.setFillColor(...colors.paleGray);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Asymmetric layout - content shifted to bottom-left
    if (coverImage) {
      try {
        let imgFormat: 'JPEG' | 'PNG' | 'WEBP' = 'JPEG';
        if (coverImage.includes('data:image/png')) {
          imgFormat = 'PNG';
        } else if (coverImage.includes('data:image/webp')) {
          imgFormat = 'WEBP';
        }
        
        // Large image taking most of page
        const imgSize = 120;
        const imgX = (pageWidth - imgSize) / 2;
        const imgY = 25;
        
        pdf.addImage(coverImage, imgFormat, imgX, imgY, imgSize, imgSize, undefined, 'MEDIUM');
        
        // Title below image with editorial typography
        let y = imgY + imgSize + 15;
        
        y = addText(summary.title.toUpperCase(), pageWidth / 2, y, {
          fontSize: 14,
          color: colors.black,
          fontStyle: 'bold',
          align: 'center',
          maxWidth: contentWidth - 10,
          lineHeight: 1.3,
        });

        y += 8;
        
        // Thin accent line
        pdf.setDrawColor(...colors.accent);
        pdf.setLineWidth(0.5);
        pdf.line(pageWidth / 2 - 20, y, pageWidth / 2 + 20, y);
        
        y += 10;

        // Date in elegant small caps style
        const dateText = format(new Date(summary.created_at), 'dd. MMMM yyyy', { locale: de });
        addText(sanitizeText(dateText), pageWidth / 2, y, {
          fontSize: 9,
          color: colors.mediumGray,
          align: 'center',
        });
      } catch (error) {
        console.error('Error adding cover image:', error);
        renderTitleWithoutImage();
      }
    } else {
      renderTitleWithoutImage();
    }

    function renderTitleWithoutImage() {
      // Dramatic typography-focused layout
      let y = pageHeight / 2 - 20;
      
      // Large editorial title
      y = addText(summary.title.toUpperCase(), pageWidth / 2, y, {
        fontSize: 18,
        color: colors.black,
        fontStyle: 'bold',
        align: 'center',
        maxWidth: contentWidth - 20,
        lineHeight: 1.2,
      });

      y += 15;
      
      // Accent line
      pdf.setDrawColor(...colors.accent);
      pdf.setLineWidth(0.8);
      pdf.line(pageWidth / 2 - 30, y, pageWidth / 2 + 30, y);
      
      y += 15;

      addText('Reflexion', pageWidth / 2, y, {
        fontSize: 11,
        color: colors.mediumGray,
        fontStyle: 'italic',
        align: 'center',
      });

      // Date at bottom
      const dateText = format(new Date(summary.created_at), 'dd. MMMM yyyy', { locale: de });
      addText(sanitizeText(dateText), pageWidth / 2, pageHeight - 25, {
        fontSize: 9,
        color: colors.mediumGray,
        align: 'center',
      });
    }

    // ===== PAGE 2: ZUSAMMENFASSUNG =====
    addPage();
    pdf.setFillColor(...colors.white);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Left margin accent bar
    pdf.setFillColor(...colors.accent);
    pdf.rect(0, 0, 4, pageHeight, 'F');

    let y = margin + 5;

    // Page header - small label
    addText('01', margin + 8, y, {
      fontSize: 8,
      color: colors.lightGray,
      fontStyle: 'bold',
    });

    y += 15;

    // Section title - editorial style
    y = addText('ZUSAMMENFASSUNG', margin + 8, y, {
      fontSize: 12,
      color: colors.black,
      fontStyle: 'bold',
    });

    y += 12;

    // Summary text - generous leading
    if (summary.structured_summary?.summary_text) {
      y = addText(summary.structured_summary.summary_text, margin + 8, y, {
        fontSize: 10,
        color: colors.darkGray,
        maxWidth: contentWidth - 16,
        lineHeight: 1.7,
      });
    }

    y += 20;

    // Patterns section
    if (summary.structured_summary?.patterns?.length) {
      y = addText('MUSTER', margin + 8, y, {
        fontSize: 10,
        color: colors.black,
        fontStyle: 'bold',
      });

      y += 8;

      summary.structured_summary.patterns.forEach((pattern) => {
        // Em dash as bullet
        y = addText(`— ${pattern}`, margin + 8, y, {
          fontSize: 9,
          color: colors.darkGray,
          maxWidth: contentWidth - 20,
          lineHeight: 1.6,
        });
        y += 4;
      });
    }

    y += 15;

    // Needs section
    if (summary.structured_summary?.needs?.length) {
      y = addText('BEDUERFNISSE', margin + 8, y, {
        fontSize: 10,
        color: colors.black,
        fontStyle: 'bold',
      });

      y += 8;

      const needsText = summary.structured_summary.needs.join('  ·  ');
      addText(needsText, margin + 8, y, {
        fontSize: 9,
        color: colors.mediumGray,
        fontStyle: 'italic',
        maxWidth: contentWidth - 16,
      });
    }

    // ===== PAGE 3: ERKENNTNISSE =====
    addPage();
    pdf.setFillColor(...colors.white);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Right margin accent bar (asymmetry)
    pdf.setFillColor(...colors.accent);
    pdf.rect(pageWidth - 4, 0, 4, pageHeight, 'F');

    y = margin + 5;

    addText('02', pageWidth - margin - 8, y, {
      fontSize: 8,
      color: colors.lightGray,
      fontStyle: 'bold',
      align: 'right',
    });

    y += 15;

    // Inner parts section
    if (summary.structured_summary?.parts?.length) {
      y = addText('INNERE ANTEILE', margin, y, {
        fontSize: 12,
        color: colors.black,
        fontStyle: 'bold',
      });

      y += 12;

      const partTypeLabels: Record<string, string> = {
        manager: 'Manager',
        firefighter: 'Feuerwehr',
        exile: 'Exilant',
        self: 'Selbst',
      };

      summary.structured_summary.parts.forEach((part) => {
        const typeLabel = partTypeLabels[part.type] || part.type;
        
        y = addText(`${part.name}`, margin, y, {
          fontSize: 10,
          color: colors.accent,
          fontStyle: 'bold',
        });
        
        y = addText(`[${typeLabel}]`, margin, y + 1, {
          fontSize: 7,
          color: colors.lightGray,
        });
        
        y += 5;
        
        y = addText(part.description, margin + 10, y, {
          fontSize: 9,
          color: colors.darkGray,
          maxWidth: contentWidth - 20,
          lineHeight: 1.5,
        });
        y += 10;
      });
    }

    y += 10;

    // Body areas section
    if (summary.structured_summary?.body_areas?.length) {
      y = addText('KOERPERBEREICHE', margin, y, {
        fontSize: 12,
        color: colors.black,
        fontStyle: 'bold',
      });

      y += 10;

      summary.structured_summary.body_areas.forEach((area) => {
        y = addText(`${area.area}`, margin, y, {
          fontSize: 9,
          color: colors.black,
          fontStyle: 'bold',
        });
        y += 1;
        y = addText(area.significance, margin + 10, y, {
          fontSize: 9,
          color: colors.darkGray,
          maxWidth: contentWidth - 20,
          lineHeight: 1.5,
        });
        y += 8;
      });
    }

    // ===== PAGE 4: EMPFEHLUNGEN =====
    addPage();
    pdf.setFillColor(...colors.paleGray);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    y = margin + 5;

    addText('03', margin, y, {
      fontSize: 8,
      color: colors.lightGray,
      fontStyle: 'bold',
    });

    y += 15;

    // Insights section
    if (summary.structured_summary?.insights?.length) {
      y = addText('ERKENNTNISSE', margin, y, {
        fontSize: 12,
        color: colors.black,
        fontStyle: 'bold',
      });

      y += 12;

      summary.structured_summary.insights.forEach((insight, index) => {
        y = addText(`${index + 1}.`, margin, y, {
          fontSize: 9,
          color: colors.accent,
          fontStyle: 'bold',
        });
        
        y = addText(insight, margin + 8, y - 3, {
          fontSize: 9,
          color: colors.darkGray,
          maxWidth: contentWidth - 15,
          lineHeight: 1.6,
        });
        y += 6;
      });
    }

    y += 15;

    // Recommendations section
    if (summary.structured_summary?.recommendations) {
      y = addText('EMPFEHLUNGEN', margin, y, {
        fontSize: 12,
        color: colors.black,
        fontStyle: 'bold',
      });

      y += 12;

      // White card for recommendations
      const cardY = y - 5;
      const cardHeight = 55;
      pdf.setFillColor(...colors.white);
      pdf.rect(margin, cardY, contentWidth, cardHeight, 'F');

      y += 5;

      const recommendations = [
        { label: 'KOERPERUEBUNG', text: summary.structured_summary.recommendations.body_exercise },
        { label: 'MIKRO-AKTION', text: summary.structured_summary.recommendations.micro_action },
        { label: 'ZUM NACHDENKEN', text: summary.structured_summary.recommendations.reflection_question },
      ].filter(r => r.text);

      recommendations.forEach((rec) => {
        y = addText(rec.label, margin + 8, y, {
          fontSize: 7,
          color: colors.accent,
          fontStyle: 'bold',
        });
        y += 3;
        
        const isQuestion = rec.label === 'ZUM NACHDENKEN';
        y = addText(isQuestion ? `"${rec.text}"` : rec.text, margin + 8, y, {
          fontSize: 9,
          color: colors.darkGray,
          fontStyle: isQuestion ? 'italic' : 'normal',
          maxWidth: contentWidth - 20,
          lineHeight: 1.5,
        });
        y += 8;
      });
    }

    // Footer
    pdf.setDrawColor(...colors.accent);
    pdf.setLineWidth(0.3);
    pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    
    addText('ORIA SELFCARE', pageWidth / 2, pageHeight - 12, {
      fontSize: 7,
      color: colors.mediumGray,
      align: 'center',
    });

    // Download
    const fileName = `Reflexion_${format(new Date(summary.created_at), 'yyyy-MM-dd')}.pdf`;
    pdf.save(fileName);
  };

  return { generatePdf };
};
