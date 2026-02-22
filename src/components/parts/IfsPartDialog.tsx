import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { IfsPart } from './IfsPartCard';

interface IfsPartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Omit<IfsPart, 'id' | 'created_at' | 'image_url'>) => void;
  editingPart?: IfsPart | null;
}

const roles = ['Manager', 'Feuerwehr', 'Exilant', 'Beschützer', 'Kritiker', 'Helfer', 'Perfektionist', 'Tröster', 'Kämpfer', 'Anderer'];

const emptyForm = {
  name: '',
  role: '',
  age: '',
  body_location: '',
  core_emotion: '',
  trigger: '',
  belief: '',
  need: '',
  protection_strategy: '',
  counterpart: '',
  self_trust_level: 5,
  integration_status: '',
  image_prompt: '',
};

export const IfsPartDialog: React.FC<IfsPartDialogProps> = ({ open, onOpenChange, onSave, editingPart }) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingPart) {
      setForm({
        name: editingPart.name,
        role: editingPart.role,
        age: editingPart.age || '',
        body_location: editingPart.body_location || '',
        core_emotion: editingPart.core_emotion || '',
        trigger: editingPart.trigger || '',
        belief: editingPart.belief || '',
        need: editingPart.need || '',
        protection_strategy: editingPart.protection_strategy || '',
        counterpart: editingPart.counterpart || '',
        self_trust_level: editingPart.self_trust_level ?? 5,
        integration_status: editingPart.integration_status || '',
        image_prompt: editingPart.image_prompt || '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingPart, open]);

  const set = (key: string, value: string | number) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave(form as any);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>{editingPart ? 'Anteil bearbeiten' : 'Neuen Anteil erfassen'}</DialogTitle>
          <DialogDescription>Beschreibe deinen inneren Anteil aus der IFS-Meditation</DialogDescription>
        </DialogHeader>

        <ScrollArea className="px-6 max-h-[60vh]">
          <div className="space-y-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="z.B. Der kleine Max" />
              </div>
              <div className="space-y-1.5">
                <Label>Rolle</Label>
                <Select value={form.role} onValueChange={v => set('role', v)}>
                  <SelectTrigger><SelectValue placeholder="Rolle wählen" /></SelectTrigger>
                  <SelectContent>
                    {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Alter</Label>
                <Input value={form.age} onChange={e => set('age', e.target.value)} placeholder="z.B. 5 Jahre" />
              </div>
              <div className="space-y-1.5">
                <Label>Körperort</Label>
                <Input value={form.body_location} onChange={e => set('body_location', e.target.value)} placeholder="z.B. Brust, Bauch" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Kernemotion</Label>
              <Input value={form.core_emotion} onChange={e => set('core_emotion', e.target.value)} placeholder="z.B. Angst, Traurigkeit, Wut" />
            </div>

            <div className="space-y-1.5">
              <Label>Trigger</Label>
              <Input value={form.trigger} onChange={e => set('trigger', e.target.value)} placeholder="Was aktiviert diesen Anteil?" />
            </div>

            <div className="space-y-1.5">
              <Label>Glaubenssatz</Label>
              <Input value={form.belief} onChange={e => set('belief', e.target.value)} placeholder='z.B. "Ich bin nicht gut genug"' />
            </div>

            <div className="space-y-1.5">
              <Label>Bedürfnis</Label>
              <Input value={form.need} onChange={e => set('need', e.target.value)} placeholder="Was braucht dieser Anteil?" />
            </div>

            <div className="space-y-1.5">
              <Label>Schutzstrategie</Label>
              <Input value={form.protection_strategy} onChange={e => set('protection_strategy', e.target.value)} placeholder="Wie schützt sich dieser Anteil?" />
            </div>

            <div className="space-y-1.5">
              <Label>Gegenspieler</Label>
              <Input value={form.counterpart} onChange={e => set('counterpart', e.target.value)} placeholder="Welcher andere Anteil steht in Beziehung?" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Vertrauen in Self</Label>
                <span className="text-sm text-muted-foreground">{form.self_trust_level}/10</span>
              </div>
              <Slider
                value={[form.self_trust_level]}
                onValueChange={([v]) => set('self_trust_level', v)}
                max={10}
                step={1}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Aktueller Integrationsstand</Label>
              <Textarea
                value={form.integration_status}
                onChange={e => set('integration_status', e.target.value)}
                placeholder="Wie ist der aktuelle Stand der Arbeit mit diesem Anteil?"
                rows={2}
                className="min-h-[80px] sm:min-h-[60px]"
              />
            </div>

            <div className="space-y-1.5 border-t border-border pt-4">
              <Label>🎨 Bildbeschreibung für AI-Generierung</Label>
              <Textarea
                value={form.image_prompt}
                onChange={e => set('image_prompt', e.target.value)}
                placeholder="Beschreibe, wie du dir diesen Anteil visuell vorstellst... z.B. 'Ein kleiner Junge in einem dunklen Wald, der ein Licht in der Hand hält'"
                rows={3}
                className="min-h-[100px] sm:min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">Das Bild kann nach dem Speichern über den Zauberstab generiert werden.</p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 pb-6 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={handleSave} disabled={!form.name.trim()}>
            {editingPart ? 'Speichern' : 'Anteil erstellen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
