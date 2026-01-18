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

// App color palette - warm terracotta tones
const colors = {
  primary: [89, 62, 48] as [number, number, number], // Terracotta/warm brown
  secondary: [128, 100, 82] as [number, number, number], // Soft brown
  accent: [205, 133, 63] as [number, number, number], // Gold/amber
  text: [51, 41, 33] as [number, number, number], // Dark warm brown
  muted: [140, 120, 105] as [number, number, number], // Muted brown
  light: [252, 250, 248] as [number, number, number], // Warm off-white (like app bg)
  divider: [225, 215, 205] as [number, number, number], // Light divider
  sage: [160, 180, 160] as [number, number, number], // Soft sage green for accents
  rose: [200, 150, 150] as [number, number, number], // Soft rose for warmth
  teal: [100, 150, 160] as [number, number, number], // Soft teal
};

// Helper to draw soft circular line art (like the reference image)
const drawCircleArt = (pdf: jsPDF, centerX: number, centerY: number, size: number = 1) => {
  const baseRadius = 12 * size;
  
  // Draw multiple overlapping soft circles with different colors
  const circles = [
    { radius: baseRadius, color: colors.sage, offset: { x: -2, y: -2 } },
    { radius: baseRadius * 0.9, color: colors.rose, offset: { x: 2, y: 0 } },
    { radius: baseRadius * 0.85, color: colors.teal, offset: { x: 0, y: 2 } },
    { radius: baseRadius * 0.95, color: colors.accent, offset: { x: -1, y: 1 } },
  ];
  
  pdf.setLineWidth(0.3);
  
  circles.forEach(circle => {
    pdf.setDrawColor(...circle.color);
    pdf.circle(
      centerX + circle.offset.x * size, 
      centerY + circle.offset.y * size, 
      circle.radius, 
      'S'
    );
  });
};

// Draw a small decorative flourish
const drawFlourish = (pdf: jsPDF, x: number, y: number, width: number) => {
  pdf.setDrawColor(...colors.sage);
  pdf.setLineWidth(0.2);
  
  // Simple curved line
  const midX = x + width / 2;
  pdf.line(x, y, midX - 5, y);
  pdf.circle(midX, y, 1.5, 'S');
  pdf.line(midX + 5, y, x + width, y);
};

// Replace special characters for PDF compatibility
const sanitizeText = (text: string): string => {
  if (!text) return '';
  
  // Map German characters to alternatives
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
    const margin = 18;
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

      // Sanitize text for proper character display
      const sanitized = sanitizeText(text);
      const lines = pdf.splitTextToSize(sanitized, maxWidth);
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

    // Decorative circle art at top
    drawCircleArt(pdf, pageWidth / 2, 50, 1.2);

    // Add cover image if provided
    if (coverImage) {
      try {
        // Detect image format from base64
        let imgFormat: 'JPEG' | 'PNG' | 'WEBP' = 'JPEG';
        if (coverImage.includes('data:image/png')) {
          imgFormat = 'PNG';
        } else if (coverImage.includes('data:image/webp')) {
          imgFormat = 'WEBP';
        }
        
        // Add image centered below circle art
        const imgWidth = contentWidth - 30;
        const imgHeight = 80;
        const imgX = (pageWidth - imgWidth) / 2;
        const imgY = 75;
        
        pdf.addImage(coverImage, imgFormat, imgX, imgY, imgWidth, imgHeight, undefined, 'MEDIUM');
        
        // Title below image
        let y = imgY + imgHeight + 20;
        
        y = addText(summary.title, pageWidth / 2, y, {
          fontSize: 22,
          color: colors.primary,
          fontStyle: 'bold',
          align: 'center',
          maxWidth: contentWidth - 20,
        });

        y += 10;
        drawFlourish(pdf, pageWidth / 2 - 30, y, 60);
        y += 12;
        
        addText('Eine persoenliche Reflexion', pageWidth / 2, y, {
          fontSize: 12,
          color: colors.muted,
          fontStyle: 'italic',
          align: 'center',
        });

        // Date at bottom
        const dateText = format(new Date(summary.created_at), 'dd. MMMM yyyy', { locale: de });
        addText(sanitizeText(dateText), pageWidth / 2, pageHeight - 40, {
          fontSize: 10,
          color: colors.muted,
          align: 'center',
        });
      } catch (error) {
        console.error('Error adding cover image:', error);
        // Fallback without image
        let y = 100;
        y = addText(summary.title, pageWidth / 2, y, {
          fontSize: 24,
          color: colors.primary,
          fontStyle: 'bold',
          align: 'center',
          maxWidth: contentWidth,
        });
        y += 12;
        addText('Eine persoenliche Reflexion', pageWidth / 2, y, {
          fontSize: 13,
          color: colors.muted,
          fontStyle: 'italic',
          align: 'center',
        });
        const dateText = format(new Date(summary.created_at), 'dd. MMMM yyyy', { locale: de });
        addText(sanitizeText(dateText), pageWidth / 2, pageHeight - 40, {
          fontSize: 10,
          color: colors.muted,
          align: 'center',
        });
      }
    } else {
      // Title page without image - elegant typography with circle art
      let y = 100;
      
      y = addText(summary.title, pageWidth / 2, y, {
        fontSize: 26,
        color: colors.primary,
        fontStyle: 'bold',
        align: 'center',
        maxWidth: contentWidth - 20,
      });

      y += 15;
      drawFlourish(pdf, pageWidth / 2 - 35, y, 70);
      y += 15;
      
      addText('Eine persoenliche Reflexion', pageWidth / 2, y, {
        fontSize: 13,
        color: colors.muted,
        fontStyle: 'italic',
        align: 'center',
      });

      // Date
      const dateText = format(new Date(summary.created_at), 'dd. MMMM yyyy', { locale: de });
      addText(sanitizeText(dateText), pageWidth / 2, pageHeight - 40, {
        fontSize: 10,
        color: colors.muted,
        align: 'center',
      });

      // Small decorative element at bottom
      drawCircleArt(pdf, pageWidth / 2, pageHeight - 55, 0.4);
    }

    // ===== PAGE 2: Summary & Patterns =====
    addPage();
    pdf.setFillColor(...colors.light);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Small decorative circle in corner
    drawCircleArt(pdf, pageWidth - 25, 25, 0.35);

    let y = margin + 10;

    // Section: Summary
    if (summary.structured_summary?.summary_text) {
      y = addText('Zusammenfassung', margin, y, {
        fontSize: 16,
        color: colors.primary,
        fontStyle: 'bold',
      });
      y += 4;
      drawLine(y, 50);
      y += 12;

      y = addText(summary.structured_summary.summary_text, margin, y, {
        fontSize: 11,
        color: colors.text,
        maxWidth: contentWidth,
      });
      y += 18;
    }

    // Section: Patterns
    if (summary.structured_summary?.patterns?.length) {
      y = addText('Erkannte Muster', margin, y, {
        fontSize: 14,
        color: colors.primary,
        fontStyle: 'bold',
      });
      y += 4;
      drawLine(y, 40);
      y += 10;

      summary.structured_summary.patterns.forEach((pattern) => {
        // Small dot as bullet
        pdf.setFillColor(...colors.accent);
        pdf.circle(margin + 2, y - 1.5, 1, 'F');
        
        y = addText(pattern, margin + 8, y, {
          fontSize: 10,
          color: colors.text,
          maxWidth: contentWidth - 10,
        });
        y += 5;
      });
      y += 10;
    }

    // Section: Needs
    if (summary.structured_summary?.needs?.length) {
      y = addText('Beruehrte Beduerfnisse', margin, y, {
        fontSize: 14,
        color: colors.primary,
        fontStyle: 'bold',
      });
      y += 4;
      drawLine(y, 55);
      y += 10;

      const needsText = summary.structured_summary.needs.join('  |  ');
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

    // Small decorative circle
    drawCircleArt(pdf, 30, pageHeight - 30, 0.35);

    y = margin + 10;

    // Section: Parts
    if (summary.structured_summary?.parts?.length) {
      y = addText('Innere Anteile', margin, y, {
        fontSize: 16,
        color: colors.primary,
        fontStyle: 'bold',
      });
      y += 4;
      drawLine(y, 40);
      y += 12;

      const partTypeLabels: Record<string, string> = {
        manager: 'Manager',
        firefighter: 'Feuerwehr',
        exile: 'Exilant',
        self: 'Selbst',
      };

      summary.structured_summary.parts.forEach((part) => {
        const typeLabel = partTypeLabels[part.type] || part.type;
        
        y = addText(part.name, margin, y, {
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
        y = addText(part.description, margin + 5, y, {
          fontSize: 10,
          color: colors.text,
          maxWidth: contentWidth - 10,
        });
        y += 10;
      });
      y += 8;
    }

    // Section: Body Areas
    if (summary.structured_summary?.body_areas?.length) {
      y = addText('Koerperbereiche', margin, y, {
        fontSize: 16,
        color: colors.primary,
        fontStyle: 'bold',
      });
      y += 4;
      drawLine(y, 45);
      y += 12;

      summary.structured_summary.body_areas.forEach((area) => {
        // Small accent dot
        pdf.setFillColor(...colors.sage);
        pdf.circle(margin + 2, y - 1.5, 1, 'F');
        
        y = addText(`${area.area}:`, margin + 8, y, {
          fontSize: 11,
          color: colors.accent,
          fontStyle: 'bold',
        });
        y += 1;
        y = addText(area.significance, margin + 8, y, {
          fontSize: 10,
          color: colors.text,
          maxWidth: contentWidth - 12,
        });
        y += 8;
      });
    }

    // ===== PAGE 4: Insights & Recommendations =====
    addPage();
    pdf.setFillColor(...colors.light);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Decorative circle in top right
    drawCircleArt(pdf, pageWidth - 30, 35, 0.4);

    y = margin + 10;

    // Section: Insights
    if (summary.structured_summary?.insights?.length) {
      y = addText('Zentrale Erkenntnisse', margin, y, {
        fontSize: 16,
        color: colors.primary,
        fontStyle: 'bold',
      });
      y += 4;
      drawLine(y, 55);
      y += 12;

      summary.structured_summary.insights.forEach((insight, index) => {
        // Numbered with accent color
        pdf.setFillColor(...colors.accent);
        pdf.circle(margin + 3, y - 1.5, 3, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text(String(index + 1), margin + 3, y - 0.5, { align: 'center' });
        
        y = addText(insight, margin + 12, y, {
          fontSize: 11,
          color: colors.text,
          maxWidth: contentWidth - 15,
        });
        y += 8;
      });
      y += 12;
    }

    // Section: Recommendations
    if (summary.structured_summary?.recommendations) {
      y = addText('Empfehlungen fuer dich', margin, y, {
        fontSize: 16,
        color: colors.primary,
        fontStyle: 'bold',
      });
      y += 4;
      drawLine(y, 60);
      y += 10;

      // Draw a subtle background box
      const boxStartY = y - 3;
      let boxEndY = boxStartY;

      const recommendations = [
        { icon: 'Koerperuebung', text: summary.structured_summary.recommendations.body_exercise },
        { icon: 'Mikro-Aktion', text: summary.structured_summary.recommendations.micro_action },
        { icon: 'Zum Nachdenken', text: summary.structured_summary.recommendations.reflection_question },
      ].filter(r => r.text);

      recommendations.forEach((rec, idx) => {
        const iconColor = idx === 0 ? colors.sage : idx === 1 ? colors.accent : colors.rose;
        
        // Small colored circle
        pdf.setFillColor(...iconColor);
        pdf.circle(margin + 3, y - 1, 2, 'F');
        
        y = addText(`${rec.icon}:`, margin + 10, y, {
          fontSize: 10,
          color: colors.secondary,
          fontStyle: 'bold',
        });
        y += 1;
        
        const text = rec.icon === 'Zum Nachdenken' ? `"${rec.text}"` : rec.text;
        y = addText(text, margin + 10, y, {
          fontSize: 10,
          color: colors.text,
          fontStyle: rec.icon === 'Zum Nachdenken' ? 'italic' : 'normal',
          maxWidth: contentWidth - 15,
        });
        y += 8;
      });

      boxEndY = y + 5;
      
      // Draw subtle border around recommendations
      pdf.setDrawColor(...colors.divider);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(margin - 5, boxStartY, contentWidth + 10, boxEndY - boxStartY, 3, 3, 'S');
    }

    // Footer on last page with decorative element
    drawFlourish(pdf, pageWidth / 2 - 25, pageHeight - 28, 50);
    addText('Erstellt mit Oria Selfcare', pageWidth / 2, pageHeight - 18, {
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
