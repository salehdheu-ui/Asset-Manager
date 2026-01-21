import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Fingerprint, Lock } from "lucide-react";
import pattern from "@assets/generated_images/subtle_islamic_geometric_pattern_background_texture.png";
import logo from "@assets/generated_images/minimalist_family_fund_logo_symbol.png";

export default function Auth() {
  const [, setLocation] = useLocation();
  const [isScanning, setIsScanning] = useState(false);

  const handleLogin = () => {
    setIsScanning(true);
    setTimeout(() => {
      setLocation("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-6 text-center overflow-hidden">
       {/* Background Texture */}
      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none z-0"
        style={{ backgroundImage: `url(${pattern})`, backgroundSize: '300px' }}
      />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-xs space-y-12"
      >
        <div className="space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/5 p-5 border border-primary/20 flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-heading text-primary mb-2">صندوق العائلة</h1>
            <p className="text-muted-foreground font-sans">نظام التشغيل العائلي</p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleLogin}
            className="group relative w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            {isScanning ? (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Fingerprint className="w-10 h-10" />
              </motion.div>
            ) : (
              <Fingerprint className="w-10 h-10" />
            )}
            
            {/* Scanning Ring */}
            {isScanning && (
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-accent"
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: [0, 1, 0], scale: 1.5 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </button>
          <p className="text-sm text-muted-foreground animate-pulse">
            {isScanning ? "جاري التحقق من الهوية..." : "اضغط للدخول الآمن"}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60 mt-12">
          <Lock className="w-3 h-3" />
          <span>محمي بواسطة السجل المؤتمن</span>
        </div>
      </motion.div>
    </div>
  );
}
