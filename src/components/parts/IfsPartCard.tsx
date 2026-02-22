import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Pencil, Trash2, User, Shield, Heart, Flame, Brain, MapPin, Sparkles, MessageCircleQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export interface IfsPart {
  id: string;
  name: string;
  image_url: string | null;
  role: string;
  age: string;
  body_location: string;
  core_emotion: string;
  trigger: string;
  belief: string;
  need: string;
  protection_strategy: string;
  counterpart: string;
  self_trust_level: number;
  integration_status: string;
  image_prompt: string;
  created_at: string;
}

interface IfsPartCardProps {
  part: IfsPart;
  onEdit: (part: IfsPart) => void;
  onDelete: (id: string) => void;
  onGenerateImage: (part: IfsPart) => void;
  onAnalyze: (part: IfsPart) => void;
  isGeneratingImage: boolean;
}

const roleColors: Record<string, string> = {
  Manager: 'from-blue-500/30 to-blue-600/10 border-blue-400/40',
  Feuerwehr: 'from-orange-500/30 to-orange-600/10 border-orange-400/40',
  Exilant: 'from-purple-500/30 to-purple-600/10 border-purple-400/40',
  Beschützer: 'from-emerald-500/30 to-emerald-600/10 border-emerald-400/40',
  Kritiker: 'from-red-500/30 to-red-600/10 border-red-400/40',
};

const getRoleGradient = (role: string) => {
  return roleColors[role] || 'from-primary/20 to-primary/5 border-primary/30';
};

const DetailRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
      <div>
        <span className="text-muted-foreground">{label}: </span>
        <span className="text-foreground">{value}</span>
      </div>
    </div>
  );
};

export const IfsPartCard: React.FC<IfsPartCardProps> = ({ part, onEdit, onDelete, onGenerateImage, onAnalyze, isGeneratingImage }) => {
  const gradient = getRoleGradient(part.role);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl border bg-gradient-to-b ${gradient} overflow-hidden shadow-lg`}
    >
      {/* Card Image / Header */}
      <div className="relative aspect-[3/2] bg-black/5 overflow-hidden">
        {part.image_url ? (
          <img src={part.image_url} alt={part.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-muted/50 to-muted/20">
            <User className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-xl font-serif font-bold text-white">{part.name}</h3>
          {part.role && (
            <span className="inline-block px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
              {part.role}
            </span>
          )}
        </div>
        {/* Generate image button */}
        <button
          onClick={() => onGenerateImage(part)}
          disabled={isGeneratingImage}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors disabled:opacity-50"
          title="Bild generieren"
        >
          {isGeneratingImage ? (
            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Card Details */}
      <div className="p-4 space-y-2.5">
        {part.age && <DetailRow icon={User} label="Alter" value={part.age} />}
        <DetailRow icon={MapPin} label="Körperort" value={part.body_location} />
        <DetailRow icon={Heart} label="Kernemotion" value={part.core_emotion} />
        <DetailRow icon={Flame} label="Trigger" value={part.trigger} />
        <DetailRow icon={Brain} label="Glaubenssatz" value={part.belief} />
        <DetailRow icon={Sparkles} label="Bedürfnis" value={part.need} />
        <DetailRow icon={Shield} label="Schutzstrategie" value={part.protection_strategy} />
        {part.counterpart && <DetailRow icon={User} label="Gegenspieler" value={part.counterpart} />}

        {/* Self trust slider display */}
        <div className="pt-2">
          <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
            <span>Vertrauen in Self</span>
            <span className="font-medium text-foreground">{part.self_trust_level}/10</span>
          </div>
          <Slider value={[part.self_trust_level]} max={10} step={1} disabled className="pointer-events-none" />
        </div>

        {part.integration_status && (
          <div className="pt-1">
            <p className="text-xs text-muted-foreground">Integrationsstand</p>
            <p className="text-sm text-foreground mt-0.5">{part.integration_status}</p>
          </div>
        )}

        {/* Analyze button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-primary hover:text-primary"
          onClick={() => onAnalyze(part)}
        >
          <MessageCircleQuestion className="w-3.5 h-3.5" />
          Oria fragen
        </Button>

        {/* Saved analysis indicator */}
        {(part as any).ai_analysis?.text && (
          <p className="text-xs text-muted-foreground text-center">✨ Analyse gespeichert</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-border/50">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onEdit(part)}>
            <Pencil className="w-3.5 h-3.5 mr-1.5" /> Bearbeiten
          </Button>
          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => onDelete(part.id)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
