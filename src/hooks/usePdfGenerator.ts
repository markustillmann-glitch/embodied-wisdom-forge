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

// Warm color palette
const colors = {
  primary: [89, 68, 54] as [number, number, number], // Warm brown
  secondary: [128, 100, 82] as [number, number, number], // Soft brown
  accent: [205, 133, 63] as [number, number, number], // Gold/amber
  text: [51, 41, 33] as [number, number, number], // Dark warm brown
  muted: [140, 120, 105] as [number, number, number], // Muted brown
  light: [250, 247, 243] as [number, number, number], // Warm off-white
  divider: [220, 210, 200] as [number, number, number], // Light divider
};

export const usePdfGenerator = () => {
  const generatePdf = async (
    summary: SummaryMemory,
    coverImage: string | null
  ): Promise<void> => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 25;
    const contentWidth = pageWidth - margin * 2;

    // Helper functions
    const addPage = () => {
      pdf.addPage();
    };

    const drawLine = (y: number, width: number = contentWidth, startX: number = margin) => {
      pdf.setDrawColor(...colors.divider);
      pdf.setLineWidth(0.3);
      pdf.line(startX, y, startX + width, y);
    };

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
      } = {}
    ): number => {
      const {
        fontSize = 11,
        color = colors.text,
        fontStyle = 'normal',
        maxWidth = contentWidth,
        align = 'left',
      } = options;

      pdf.setFontSize(fontSize);
      pdf.setTextColor(...color);
      pdf.setFont('helvetica', fontStyle);

      const lines = pdf.splitTextToSize(text, maxWidth);
      const lineHeight = fontSize * 0.45;

      lines.forEach((line: string, index: number) => {
        let xPos = x;
        if (align === 'center') {
          xPos = pageWidth / 2;
        } else if (align === 'right') {
          xPos = pageWidth - margin;
        }
        pdf.text(line, xPos, y + index * lineHeight, { align });
      });

      return y + lines.length * lineHeight;
    };

    // ===== PAGE 1: Title Page =====
    // Background color
    pdf.setFillColor(...colors.light);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Add cover image if provided
    if (coverImage) {
      try {
        // Add image centered, taking up top portion of page
        const imgWidth = contentWidth - 20;
        const imgHeight = 100;
        const imgX = (pageWidth - imgWidth) / 2;
        const imgY = 40;
        
        pdf.addImage(coverImage, 'JPEG', imgX, imgY, imgWidth, imgHeight, undefined, 'MEDIUM');
        
        // Title below image
        let y = imgY + imgHeight + 25;
        
        y = addText(summary.title, pageWidth / 2, y, {
          fontSize: 24,
          color: colors.primary,
          fontStyle: 'bold',
          align: 'center',
          maxWidth: contentWidth,
        });

        y += 12;
        addText('Eine persönliche Reflexion', pageWidth / 2, y, {
          fontSize: 13,
          color: colors.muted,
          fontStyle: 'italic',
          align: 'center',
        });

        // Date at bottom
        const dateText = format(new Date(summary.created_at), 'dd. MMMM yyyy', { locale: de });
        addText(dateText, pageWidth / 2, pageHeight - 40, {
          fontSize: 11,
          color: colors.muted,
          align: 'center',
        });
      } catch (error) {
        console.error('Error adding cover image:', error);
        // Fallback: title page without image
        let y = 100;
        y = addText(summary.title, pageWidth / 2, y, {
          fontSize: 28,
          color: colors.primary,
          fontStyle: 'bold',
          align: 'center',
          maxWidth: contentWidth,
        });
        y += 15;
        addText('Eine persönliche Reflexion', pageWidth / 2, y, {
          fontSize: 14,
          color: colors.muted,
          fontStyle: 'italic',
          align: 'center',
        });
        const dateText = format(new Date(summary.created_at), 'dd. MMMM yyyy', { locale: de });
        addText(dateText, pageWidth / 2, pageHeight - 40, {
          fontSize: 11,
          color: colors.muted,
          align: 'center',
        });
      }
    } else {
      // Title page without image - elegant typography only
      let y = 90;
      
      // Decorative element
      pdf.setFillColor(...colors.accent);
      pdf.circle(pageWidth / 2, y - 20, 2, 'F');
      
      y = addText(summary.title, pageWidth / 2, y, {
        fontSize: 28,
        color: colors.primary,
        fontStyle: 'bold',
        align: 'center',
        maxWidth: contentWidth,
      });

      y += 15;
      addText('Eine persönliche Reflexion', pageWidth / 2, y, {
        fontSize: 14,
        color: colors.muted,
        fontStyle: 'italic',
        align: 'center',
      });

      // Date
      const dateText = format(new Date(summary.created_at), 'dd. MMMM yyyy', { locale: de });
      addText(dateText, pageWidth / 2, pageHeight - 40, {
        fontSize: 11,
        color: colors.muted,
        align: 'center',
      });

      // Decorative element at bottom
      pdf.setFillColor(...colors.accent);
      pdf.circle(pageWidth / 2, pageHeight - 25, 2, 'F');
    }

    // ===== PAGE 2: Summary & Patterns =====
    addPage();
    pdf.setFillColor(...colors.light);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    let y = margin + 10;

    // Section: Summary
    if (summary.structured_summary?.summary_text) {
      y = addText('Zusammenfassung', margin, y, {
        fontSize: 16,
        color: colors.primary,
        fontStyle: 'bold',
      });
      y += 5;
      drawLine(y, 40);
      y += 12;

      y = addText(summary.structured_summary.summary_text, margin, y, {
        fontSize: 11,
        color: colors.text,
        maxWidth: contentWidth,
      });
      y += 15;
    }

    // Section: Patterns
    if (summary.structured_summary?.patterns?.length) {
      y = addText('Erkannte Muster', margin, y, {
        fontSize: 14,
        color: colors.primary,
        fontStyle: 'bold',
      });
      y += 4;
      drawLine(y, 35);
      y += 10;

      summary.structured_summary.patterns.forEach((pattern) => {
        y = addText(`• ${pattern}`, margin + 3, y, {
          fontSize: 10,
          color: colors.text,
          maxWidth: contentWidth - 6,
        });
        y += 4;
      });
      y += 8;
    }

    // Section: Needs
    if (summary.structured_summary?.needs?.length) {
      y = addText('Berührte Bedürfnisse', margin, y, {
        fontSize: 14,
        color: colors.primary,
        fontStyle: 'bold',
      });
      y += 4;
      drawLine(y, 45);
      y += 10;

      const needsText = summary.structured_summary.needs.join(' • ');
      y = addText(needsText, margin, y, {
        fontSize: 11,
        color: colors.secondary,
        fontStyle: 'italic',
        maxWidth: contentWidth,
      });
    }

    // ===== PAGE 3: Inner Parts & Body Areas =====
    addPage();
    pdf.setFillColor(...colors.light);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    y = margin + 10;

    // Section: Parts
    if (summary.structured_summary?.parts?.length) {
      y = addText('Innere Anteile', margin, y, {
        fontSize: 16,
        color: colors.primary,
        fontStyle: 'bold',
      });
      y += 5;
      drawLine(y, 35);
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
          fontSize: 12,
          color: colors.accent,
          fontStyle: 'bold',
        });
        y += 1;
        y = addText(`[${typeLabel}]`, margin, y, {
          fontSize: 9,
          color: colors.muted,
          fontStyle: 'italic',
        });
        y += 2;
        y = addText(part.description, margin + 3, y, {
          fontSize: 10,
          color: colors.text,
          maxWidth: contentWidth - 6,
        });
        y += 8;
      });
      y += 5;
    }

    // Section: Body Areas
    if (summary.structured_summary?.body_areas?.length) {
      y = addText('Körperbereiche', margin, y, {
        fontSize: 16,
        color: colors.primary,
        fontStyle: 'bold',
      });
      y += 5;
      drawLine(y, 40);
      y += 12;

      summary.structured_summary.body_areas.forEach((area) => {
        y = addText(`${area.area}:`, margin, y, {
          fontSize: 11,
          color: colors.accent,
          fontStyle: 'bold',
        });
        y += 1;
        y = addText(area.significance, margin + 3, y, {
          fontSize: 10,
          color: colors.text,
          maxWidth: contentWidth - 6,
        });
        y += 6;
      });
    }

    // ===== PAGE 4: Insights & Recommendations =====
    addPage();
    pdf.setFillColor(...colors.light);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    y = margin + 10;

    // Section: Insights
    if (summary.structured_summary?.insights?.length) {
      y = addText('Zentrale Erkenntnisse', margin, y, {
        fontSize: 16,
        color: colors.primary,
        fontStyle: 'bold',
      });
      y += 5;
      drawLine(y, 50);
      y += 12;

      summary.structured_summary.insights.forEach((insight, index) => {
        y = addText(`${index + 1}. ${insight}`, margin, y, {
          fontSize: 11,
          color: colors.text,
          maxWidth: contentWidth,
        });
        y += 6;
      });
      y += 10;
    }

    // Section: Recommendations
    if (summary.structured_summary?.recommendations) {
      y = addText('Empfehlungen für dich', margin, y, {
        fontSize: 16,
        color: colors.primary,
        fontStyle: 'bold',
      });
      y += 5;
      drawLine(y, 55);
      y += 12;

      // Draw a subtle background box
      const boxHeight = 70;
      pdf.setFillColor(245, 240, 235);
      pdf.roundedRect(margin - 5, y - 5, contentWidth + 10, boxHeight, 5, 5, 'F');

      if (summary.structured_summary.recommendations.body_exercise) {
        y = addText('🧘 Körperübung:', margin, y, {
          fontSize: 10,
          color: colors.accent,
          fontStyle: 'bold',
        });
        y += 1;
        y = addText(summary.structured_summary.recommendations.body_exercise, margin + 3, y, {
          fontSize: 10,
          color: colors.text,
          maxWidth: contentWidth - 6,
        });
        y += 6;
      }

      if (summary.structured_summary.recommendations.micro_action) {
        y = addText('✨ Mikro-Aktion:', margin, y, {
          fontSize: 10,
          color: colors.accent,
          fontStyle: 'bold',
        });
        y += 1;
        y = addText(summary.structured_summary.recommendations.micro_action, margin + 3, y, {
          fontSize: 10,
          color: colors.text,
          maxWidth: contentWidth - 6,
        });
        y += 6;
      }

      if (summary.structured_summary.recommendations.reflection_question) {
        y = addText('💭 Zum Nachdenken:', margin, y, {
          fontSize: 10,
          color: colors.accent,
          fontStyle: 'bold',
        });
        y += 1;
        y = addText(`„${summary.structured_summary.recommendations.reflection_question}"`, margin + 3, y, {
          fontSize: 10,
          color: colors.text,
          fontStyle: 'italic',
          maxWidth: contentWidth - 6,
        });
      }
    }

    // Footer on last page
    addText('Erstellt mit Oria Selfcare', pageWidth / 2, pageHeight - 20, {
      fontSize: 8,
      color: colors.muted,
      align: 'center',
    });

    // Download the PDF
    const fileName = `Reflexion_${format(new Date(summary.created_at), 'yyyy-MM-dd')}.pdf`;
    pdf.save(fileName);
  };

  return { generatePdf };
};
