import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { z } from "zod";

type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  interest: "schnupperabend" | "einfuehrung" | "jahresprogramm";
  message?: string;
};

const getInterestOptions = (t: (key: string) => string) => [
  { value: "schnupperabend", label: t('form.interestTaster') + " (2h, Online)" },
  { value: "einfuehrung", label: t('form.interestIntro') + " (4h / 1 day)" },
  { value: "jahresprogramm", label: t('form.interestAnnual') + " (12 months)" },
];

export const SeminarContactForm = () => {
  const { t } = useLanguage();
  const interestOptions = getInterestOptions(t);
  
  // Create schema with translated messages
  const contactSchema = z.object({
    name: z.string().trim().min(1, t('form.validationName')).max(100, t('form.validationNameTooLong')),
    email: z.string().trim().email(t('form.validationEmail')).max(255, t('form.validationEmailTooLong')),
    phone: z.string().trim().max(30, t('form.validationPhone')).optional().or(z.literal("")),
    interest: z.enum(["schnupperabend", "einfuehrung", "jahresprogramm"], {
      required_error: t('form.validationInterest'),
    }),
    message: z.string().trim().max(2000, t('form.validationMessage')).optional().or(z.literal("")),
  });

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
        title: t('form.successTitle'),
        description: t('form.successMessage'),
      });
    } catch (error) {
      // Only log detailed errors in development to prevent information leakage
      if (import.meta.env.DEV) {
        console.error("Error submitting inquiry:", error);
      }
      toast({
        title: t('form.errorTitle'),
        description: t('form.errorMessage'),
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
          {t('form.successTitle')}
        </h3>
        <p className="text-muted-foreground">
          {t('form.successMessage')}
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
          {t('form.submit')}
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-foreground">
            {t('form.name')} *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder={t('form.namePlaceholder')}
            className={errors.name ? "border-destructive" : ""}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            {t('form.email')} *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder={t('form.emailPlaceholder')}
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
            {t('form.phone')}
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder={t('form.phonePlaceholder')}
            className={errors.phone ? "border-destructive" : ""}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="interest" className="text-sm font-medium text-foreground">
            {t('form.interest')} *
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
            <option value="">{t('form.interestPlaceholder')}</option>
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
          {t('form.message')}
        </Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder={t('form.messagePlaceholder')}
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
            {t('form.submitting')}
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            {t('form.submit')}
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        * {t('form.requiredFields')}
      </p>
    </form>
  );
};
