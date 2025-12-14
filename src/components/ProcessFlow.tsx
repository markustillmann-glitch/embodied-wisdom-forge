import { motion } from "framer-motion";
import { ArrowDown, GitBranch } from "lucide-react";

const steps = [
  { label: "AUSLÖSER", desc: "Trigger im Außen: Kritik, Blick, Zeitdruck", color: "bg-muted" },
  { label: "SOMATISCHE REAKTION", desc: "Implizites Gedächtnis feuert: Alarm, Anspannung", color: "bg-muted" },
  { label: "TEIL-AKTIVIERUNG & ERBE", desc: "Ein Beschützer-Teil übernimmt", color: "bg-muted" },
];

const fork = {
  auto: { label: "AUTOMATIK-ROUTE", desc: "Reagieren (Fight/Flight/Freeze)", color: "bg-destructive/20" },
  pause: { label: "DIE PAUSE / SELF-ENERGY", desc: "Wahrnehmung + Neugier statt Identifikation", color: "bg-accent/20" },
};

const integration = [
  { label: "ÜBERSETZUNG", desc: "NVC-Check-In: Gefühl + Bedürfnis", color: "bg-accent/20" },
  { label: "BEWUSSTE HANDLUNG", desc: "Antworten statt Reagieren", color: "bg-accent/30" },
];

export const ProcessFlow = () => {
  return (
    <div className="my-12 py-8">
      <div className="max-w-lg mx-auto">
        {/* Initial steps */}
        {steps.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <div className={`${step.color} rounded-lg p-4 text-center border border-border`}>
              <p className="font-sans font-semibold text-sm tracking-wide text-foreground">{step.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
            </div>
            <div className="flex justify-center py-2">
              <ArrowDown className="w-5 h-5 text-muted-foreground" />
            </div>
          </motion.div>
        ))}

        {/* Fork */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative my-4"
        >
          <div className="flex justify-center mb-2">
            <GitBranch className="w-6 h-6 text-accent rotate-180" />
          </div>
          <p className="text-center text-sm font-semibold text-accent tracking-wider mb-4">
            DIE ENTSCHEIDENDE GABELUNG
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className={`${fork.auto.color} rounded-lg p-3 text-center border border-destructive/30`}>
              <p className="font-sans font-semibold text-xs tracking-wide text-foreground">{fork.auto.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{fork.auto.desc}</p>
            </div>
            <div className={`${fork.pause.color} rounded-lg p-3 text-center border border-accent/50`}>
              <p className="font-sans font-semibold text-xs tracking-wide text-foreground">{fork.pause.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{fork.pause.desc}</p>
            </div>
          </div>
        </motion.div>

        {/* Integration path */}
        <div className="flex justify-center py-2">
          <ArrowDown className="w-5 h-5 text-accent" />
        </div>

        {integration.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
          >
            <div className={`${step.color} rounded-lg p-4 text-center border border-accent/30`}>
              <p className="font-sans font-semibold text-sm tracking-wide text-foreground">{step.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
            </div>
            {i < integration.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowDown className="w-5 h-5 text-accent" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
