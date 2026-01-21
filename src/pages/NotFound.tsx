import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { PolygonalBackground, ConnectionLines } from "@/components/PolygonalBackground";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden pt-[max(env(safe-area-inset-top),20px)] pb-[max(env(safe-area-inset-bottom),24px)]">
      <PolygonalBackground variant="hero" />
      
      {/* Decorative elements */}
      <ConnectionLines className="absolute top-20 left-10 w-24 h-24 opacity-40 hidden md:block" />
      <ConnectionLines className="absolute bottom-20 right-10 w-32 h-32 opacity-30 hidden md:block" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-sm font-sans tracking-[0.3em] text-muted-foreground uppercase mb-4"
        >
          Seite nicht gefunden
        </motion.p>
        
        <h1 className="mb-4 text-7xl md:text-8xl font-serif font-medium text-foreground">
          <span className="text-accent">404</span>
        </h1>
        
        <p className="mb-8 text-lg text-muted-foreground max-w-md mx-auto">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/selfcare" className="inline-flex items-center gap-2">
              <Home className="w-4 h-4" />
              Zur Selfcare App
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
