import { motion } from "framer-motion";

interface PolygonalBackgroundProps {
  variant?: "hero" | "section" | "accent" | "subtle" | "warm" | "flow";
  className?: string;
}

export const PolygonalBackground = ({ variant = "hero", className = "" }: PolygonalBackgroundProps) => {
  if (variant === "hero") {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {/* Large flowing polygonal shapes */}
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="heroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.08" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="heroGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.03" />
            </linearGradient>
          </defs>
          
          {/* Large flowing organic shape */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            d="M0,400 Q200,200 400,350 T800,300 T1200,400 L1200,800 L0,800 Z"
            fill="url(#heroGrad1)"
          />
          
          {/* Overlapping polygonal shape */}
          <motion.path
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            d="M-100,600 L300,300 L600,450 L900,250 L1300,500 L1300,900 L-100,900 Z"
            fill="url(#heroGrad2)"
          />
          
          {/* Subtle accent lines */}
          <motion.path
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2, delay: 0.5 }}
            d="M100,500 Q400,350 700,400 T1100,350"
            stroke="hsl(var(--accent))"
            strokeWidth="1"
            fill="none"
            strokeOpacity="0.2"
          />
        </motion.svg>
        
        {/* Floating circles for depth */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-accent/5 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="absolute bottom-1/3 left-1/5 w-48 h-48 rounded-full bg-primary/5 blur-2xl"
        />
      </div>
    );
  }

  if (variant === "section") {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <svg
          className="absolute w-full h-full opacity-60"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="sectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.06" />
              <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.04" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          
          {/* Gentle wave pattern */}
          <path
            d="M0,100 Q300,50 600,100 T1200,80 L1200,600 L0,600 Z"
            fill="url(#sectionGrad)"
          />
          
          {/* Subtle geometric accents */}
          <polygon
            points="0,300 150,200 300,280 0,400"
            fill="hsl(var(--accent))"
            fillOpacity="0.03"
          />
          <polygon
            points="1200,250 1050,150 900,230 1200,350"
            fill="hsl(var(--accent))"
            fillOpacity="0.03"
          />
        </svg>
      </div>
    );
  }

  if (variant === "warm") {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="warmGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.12" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="warmGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="hsl(38 60% 60%)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="hsl(35 40% 70%)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          
          {/* Embracing curves - symbolizing growth and connection */}
          <path
            d="M-50,400 C200,200 400,600 600,400 C800,200 1000,500 1250,350 L1250,850 L-50,850 Z"
            fill="url(#warmGrad1)"
          />
          
          {/* Inner layer for depth */}
          <path
            d="M0,500 C150,350 350,550 500,450 C650,350 800,500 1000,400 C1100,350 1150,400 1200,380 L1200,800 L0,800 Z"
            fill="url(#warmGrad2)"
          />
          
          {/* Soft connecting lines - representing neural pathways */}
          <g stroke="hsl(var(--accent))" strokeOpacity="0.15" fill="none" strokeWidth="1">
            <path d="M100,300 Q300,250 500,300 Q700,350 900,280" />
            <path d="M200,400 Q400,320 600,380 Q800,440 1000,360" />
          </g>
        </svg>
        
        {/* Warm glow spots */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-accent/5 blur-2xl" />
      </div>
    );
  }

  if (variant === "flow") {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="flowGrad1" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.04" />
              <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.08" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
            </linearGradient>
            <linearGradient id="flowGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.06" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          
          {/* Flowing transformation curves */}
          <path
            d="M-100,200 C100,100 300,300 500,200 C700,100 900,300 1100,180 C1200,140 1250,200 1300,250 L1300,800 L-100,800 Z"
            fill="url(#flowGrad1)"
          />
          
          {/* Overlapping wave */}
          <path
            d="M-50,400 C150,300 350,450 550,350 C750,250 950,400 1150,320 L1250,300 L1250,800 L-50,800 Z"
            fill="url(#flowGrad2)"
          />
          
          {/* Delicate accent shapes */}
          <circle cx="200" cy="150" r="80" fill="hsl(var(--accent))" fillOpacity="0.04" />
          <circle cx="1000" cy="250" r="100" fill="hsl(var(--accent))" fillOpacity="0.03" />
          <circle cx="600" cy="100" r="60" fill="hsl(var(--primary))" fillOpacity="0.03" />
        </svg>
      </div>
    );
  }

  if (variant === "accent") {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 1200 400"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.1" />
              <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.15" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Dynamic angular shapes */}
          <polygon
            points="0,100 400,0 600,150 1000,50 1200,180 1200,400 0,400"
            fill="url(#accentGrad)"
          />
          
          {/* Small accent triangles */}
          <polygon points="50,200 120,150 100,220" fill="hsl(var(--accent))" fillOpacity="0.08" />
          <polygon points="1100,180 1150,120 1180,190" fill="hsl(var(--accent))" fillOpacity="0.06" />
        </svg>
      </div>
    );
  }

  // subtle variant
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="absolute w-full h-full opacity-40"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="subtleGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.5" />
            <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        
        <path
          d="M0,200 Q300,100 600,200 T1200,150 L1200,400 L0,400 Z"
          fill="url(#subtleGrad)"
        />
      </svg>
    </div>
  );
};

// Decorative element for emotional connection
export const ConnectionLines = ({ className = "" }: { className?: string }) => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className={`absolute pointer-events-none ${className}`}
      width="200"
      height="200"
      viewBox="0 0 200 200"
    >
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      
      {/* Neural-like connection pattern */}
      <motion.circle
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        cx="100" cy="100" r="8"
        fill="hsl(var(--accent))"
        fillOpacity="0.2"
      />
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        d="M100,100 Q60,60 30,80"
        stroke="url(#lineGrad)"
        strokeWidth="2"
        fill="none"
      />
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        d="M100,100 Q140,50 170,70"
        stroke="url(#lineGrad)"
        strokeWidth="2"
        fill="none"
      />
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        d="M100,100 Q80,140 50,160"
        stroke="url(#lineGrad)"
        strokeWidth="2"
        fill="none"
      />
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.6 }}
        d="M100,100 Q130,150 160,140"
        stroke="url(#lineGrad)"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Small endpoint circles */}
      <circle cx="30" cy="80" r="4" fill="hsl(var(--accent))" fillOpacity="0.15" />
      <circle cx="170" cy="70" r="4" fill="hsl(var(--accent))" fillOpacity="0.15" />
      <circle cx="50" cy="160" r="4" fill="hsl(var(--accent))" fillOpacity="0.15" />
      <circle cx="160" cy="140" r="4" fill="hsl(var(--accent))" fillOpacity="0.15" />
    </motion.svg>
  );
};

// Simple owl decorative element - Oria symbol
export const OwlSymbol = ({ className = "" }: { className?: string }) => {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`pointer-events-none ${className}`}
      width="80"
      height="80"
      viewBox="0 0 80 80"
    >
      {/* Simple owl face outline */}
      <motion.ellipse
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        cx="40"
        cy="45"
        rx="28"
        ry="30"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        fill="hsl(var(--accent))"
        fillOpacity="0.05"
        strokeOpacity="0.3"
      />
      {/* Left eye */}
      <motion.circle
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.5 }}
        cx="30"
        cy="40"
        r="8"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        fill="none"
        strokeOpacity="0.4"
      />
      {/* Right eye */}
      <motion.circle
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
        cx="50"
        cy="40"
        r="8"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        fill="none"
        strokeOpacity="0.4"
      />
      {/* Pupils */}
      <circle cx="30" cy="40" r="3" fill="hsl(var(--accent))" fillOpacity="0.2" />
      <circle cx="50" cy="40" r="3" fill="hsl(var(--accent))" fillOpacity="0.2" />
      {/* Beak */}
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.7 }}
        d="M40,48 L36,56 L40,54 L44,56 L40,48"
        stroke="hsl(var(--accent))"
        strokeWidth="1"
        fill="hsl(var(--accent))"
        fillOpacity="0.1"
        strokeOpacity="0.3"
      />
      {/* Ear tufts */}
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        d="M18,28 L24,18 L30,26"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        fill="none"
        strokeOpacity="0.3"
      />
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        d="M62,28 L56,18 L50,26"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        fill="none"
        strokeOpacity="0.3"
      />
    </motion.svg>
  );
};

// Wisdom/insight symbol - third eye / awareness
export const InsightSymbol = ({ className = "" }: { className?: string }) => {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`pointer-events-none ${className}`}
      width="80"
      height="80"
      viewBox="0 0 80 80"
    >
      {/* Eye shape */}
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
        d="M10,40 Q40,15 70,40 Q40,65 10,40"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        fill="hsl(var(--accent))"
        fillOpacity="0.05"
        strokeOpacity="0.3"
      />
      {/* Inner circle */}
      <motion.circle
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.6 }}
        cx="40"
        cy="40"
        r="12"
        stroke="hsl(var(--accent))"
        strokeWidth="1"
        fill="hsl(var(--accent))"
        fillOpacity="0.08"
        strokeOpacity="0.25"
      />
      {/* Pupil */}
      <motion.circle
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.8 }}
        cx="40"
        cy="40"
        r="5"
        fill="hsl(var(--accent))"
        fillOpacity="0.2"
      />
    </motion.svg>
  );
};

// Moon/night symbol - representing inner work
export const MoonSymbol = ({ className = "" }: { className?: string }) => {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`pointer-events-none ${className}`}
      width="80"
      height="80"
      viewBox="0 0 80 80"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.2 }}
        d="M55,15 A28,28 0 1,0 55,65 A22,22 0 1,1 55,15"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        fill="hsl(var(--accent))"
        fillOpacity="0.08"
        strokeOpacity="0.3"
      />
      {/* Small stars */}
      <circle cx="25" cy="25" r="2" fill="hsl(var(--accent))" fillOpacity="0.2" />
      <circle cx="18" cy="40" r="1.5" fill="hsl(var(--accent))" fillOpacity="0.15" />
      <circle cx="30" cy="55" r="1.5" fill="hsl(var(--accent))" fillOpacity="0.15" />
    </motion.svg>
  );
};

// Growth/transformation symbol
export const GrowthSpiral = ({ className = "" }: { className?: string }) => {
  return (
    <motion.svg
      initial={{ opacity: 0, rotate: -90 }}
      whileInView={{ opacity: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className={`pointer-events-none ${className}`}
      width="120"
      height="120"
      viewBox="0 0 120 120"
    >
      <defs>
        <linearGradient id="spiralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.3 }}
        d="M60,60 Q60,40 75,35 Q95,30 100,50 Q105,75 80,85 Q50,95 35,70 Q20,40 50,25 Q85,10 105,45"
        stroke="url(#spiralGrad)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Small accent dot at the end */}
      <motion.circle
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 2 }}
        cx="105"
        cy="45"
        r="4"
        fill="hsl(var(--accent))"
        fillOpacity="0.5"
      />
    </motion.svg>
  );
};
