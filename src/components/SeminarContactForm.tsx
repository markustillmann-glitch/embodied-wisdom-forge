import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Bitte geben Sie Ihren Namen ein").max(100, "Name zu lang"),
  email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse ein").max(255, "E-Mail zu lang"),
  phone: z.string().trim().max(30, "Telefonnummer zu lang").optional().or(z.literal("")),
  interest: z.enum(["schnupperabend", "einfuehrung", "jahresprogramm"], {
    required_error: "Bitte wählen Sie ein Seminarformat",
  }),
  message: z.string().trim().max(2000, "Nachricht zu lang").optional().or(z.literal("")),
});

type ContactFormData = z.infer<typeof contactSchema>;

const interestOptions = [
  { value: "schnupperabend", label: "Schnupperabend (2 Stunden, Online)" },
  { value: "einfuehrung", label: "Einführungsseminar (4 Stunden / 1 Tag)" },
  { value: "jahresprogramm", label: "Jahrescoaching (12 Monate)" },
];

export const SeminarContactForm = () => {
  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    name: "",
    email: "",
    phone: "",
    interest: undefined,
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form data
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("seminar_inquiries").insert({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || null,
        interest: result.data.interest,
        message: result.data.message || null,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Anfrage gesendet",
        description: "Vielen Dank für Ihr Interesse! Wir melden uns in Kürze bei Ihnen.",
      });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "Fehler",
        description: "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-xl font-serif text-foreground mb-2">
          Vielen Dank für Ihre Anfrage!
        </h3>
        <p className="text-muted-foreground">
          Wir haben Ihre Nachricht erhalten und werden uns in Kürze bei Ihnen melden.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              name: "",
              email: "",
              phone: "",
              interest: undefined,
              message: "",
            });
          }}
        >
          Weitere Anfrage senden
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            Name *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ihr vollständiger Name"
            className={errors.name ? "border-destructive" : ""}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            E-Mail *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="ihre@email.de"
            className={errors.email ? "border-destructive" : ""}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-foreground">
            Telefon (optional)
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+49 123 456789"
            className={errors.phone ? "border-destructive" : ""}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="interest" className="text-sm font-medium text-foreground">
            Interesse an *
          </Label>
          <select
            id="interest"
            value={formData.interest || ""}
            onChange={(e) => handleChange("interest", e.target.value)}
            className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.interest ? "border-destructive" : "border-input"
            }`}
            disabled={isSubmitting}
          >
            <option value="">Bitte wählen...</option>
            {interestOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.interest && (
            <p className="text-xs text-destructive">{errors.interest}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium text-foreground">
          Nachricht (optional)
        </Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Ihre Fragen oder Anmerkungen..."
          rows={4}
          className={errors.message ? "border-destructive" : ""}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto font-sans"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Wird gesendet...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Anfrage senden
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        * Pflichtfelder. Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.
      </p>
    </form>
  );
};
