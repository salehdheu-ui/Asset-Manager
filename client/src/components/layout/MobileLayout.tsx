import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  HandCoins, 
  Menu, 
  Wallet, 
  Users, 
  Settings, 
  CreditCard,
  X,
  ChevronLeft,
  ShieldCheck,
  History,
  Info
} from "lucide-react";
import pattern from "@assets/generated_images/subtle_islamic_geometric_pattern_background_texture.png";
import logo from "@assets/generated_images/minimalist_family_fund_logo_symbol.png";
import { CURRENT_USER } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export default function MobileLayout({ children, title }: MobileLayoutProps) {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const familyName = localStorage.getItem("familyName") || "صندوق العائلة";

  const navItems = [
    { href: "/dashboard", icon: Home, label: "الرئيسية", desc: "نظرة عامة على الصندوق" },
    { href: "/payments", icon: CreditCard, label: "المساهمات", desc: "سجل الدفع السنوي" },
    { href: "/expenses", icon: Wallet, label: "الإنفاق", desc: "الزكاة والمصروفات" },
    { href: "/loans", icon: HandCoins, label: "السلف", desc: "طلبات القروض العائلية" },
    { href: "/members", icon: Users, label: "الأعضاء", desc: "إدارة أفراد العائلة" },
    { href: "/governance", icon: ShieldCheck, label: "الحوكمة", desc: "قوانين الصندوق والقرارات" },
    { href: "/ledger", icon: History, label: "السجل", desc: "سجل الثقة والعمليات" },
    { href: "/settings", icon: Settings, label: "الإعدادات", desc: "تخصيص النظام" },
  ];

  const bottomNavItems = navItems.slice(0, 5);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col mx-auto max-w-md shadow-2xl">
      {/* Background Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: `url(${pattern})`, backgroundSize: '300px' }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 pt-12 pb-6 bg-gradient-to-b from-background via-background/95 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary/10 p-2 flex items-center justify-center border border-primary/20">
                <img src={logo} alt="Logo" className="w-full h-full object-contain opacity-80" />
             </div>
             <div>
               <h1 className="text-xl font-bold font-heading text-primary leading-tight">{title || familyName}</h1>
               <div className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 <p className="text-[10px] text-muted-foreground font-sans uppercase tracking-wider">
                   {CURRENT_USER.role === 'guardian' ? 'الوصي المسؤول' : 'عضو الصندوق'}
                 </p>
               </div>
             </div>
          </div>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2.5 hover:bg-primary/5 rounded-2xl transition-all border border-transparent active:border-primary/10 relative group"
          >
            <Menu className="w-6 h-6 text-primary" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
          </button>
        </div>
      </header>

      {/* Side Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] max-w-md mx-auto"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-4/5 bg-card z-[70] shadow-2xl p-6 flex flex-col max-w-[320px]"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <img src={logo} className="w-5 h-5 opacity-80" />
                  </div>
                  <span className="font-bold text-primary font-heading">القائمة الرئيسية</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a 
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl transition-all border",
                        location === item.href 
                          ? "bg-primary/5 border-primary/20 text-primary shadow-sm" 
                          : "border-transparent hover:bg-muted/50 text-muted-foreground"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-xl",
                        location === item.href ? "bg-primary/10" : "bg-muted"
                      )}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm">{item.label}</div>
                        <div className="text-[10px] opacity-70">{item.desc}</div>
                      </div>
                      <ChevronLeft className="w-4 h-4 mr-auto opacity-30" />
                    </a>
                  </Link>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <div className="bg-muted/30 p-4 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary text-xs">
                      {CURRENT_USER.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{CURRENT_USER.name}</div>
                      <div className="text-[9px] text-muted-foreground uppercase tracking-widest">{CURRENT_USER.role}</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                    "نحن نؤمن بأن المال وسيلة لتمكين العائلة وتعزيز أواصر المودة."
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-6 pb-28 overflow-y-auto scrollbar-hide">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card/90 backdrop-blur-xl border-t border-border/40 z-50 pb-8 pt-3 px-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <ul className="flex justify-between items-center">
          {bottomNavItems.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.href} className="flex-1">
                <Link href={item.href}>
                  <a className={cn(
                    "flex flex-col items-center gap-1.5 py-1 rounded-2xl transition-all duration-300 relative group",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-primary/70"
                  )}>
                    {isActive && (
                      <motion.div 
                        layoutId="nav-active"
                        className="absolute -top-3 w-8 h-1 bg-primary rounded-full"
                      />
                    )}
                    <item.icon className={cn("w-5 h-5 transition-transform group-active:scale-90", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
