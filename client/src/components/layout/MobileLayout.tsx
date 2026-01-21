import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, FileText, HandCoins, ShieldCheck, Menu, Wallet, Users, Settings, CreditCard } from "lucide-react";
import pattern from "@assets/generated_images/subtle_islamic_geometric_pattern_background_texture.png";
import logo from "@assets/generated_images/minimalist_family_fund_logo_symbol.png";
import { CURRENT_USER } from "@/lib/mock-data";

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

export default function MobileLayout({ children, title }: MobileLayoutProps) {
  const [location] = useLocation();
  const familyName = localStorage.getItem("familyName") || "صندوق العائلة";

  const navItems = [
    { href: "/dashboard", icon: Home, label: "الرئيسية" },
    { href: "/payments", icon: CreditCard, label: "المساهمات" },
    { href: "/expenses", icon: Wallet, label: "الإنفاق" },
    { href: "/loans", icon: HandCoins, label: "السلف" },
    { href: "/members", icon: Users, label: "الأعضاء" },
    { href: "/settings", icon: Settings, label: "الإعدادات" },
  ];

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
               <h1 className="text-xl font-bold font-heading text-primary">{title || familyName}</h1>
               <div className="flex items-center gap-1.5">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 <p className="text-xs text-muted-foreground font-sans">
                   {CURRENT_USER.role === 'guardian' ? 'حساب الوصي' : 'حساب العائلة'}
                 </p>
               </div>
             </div>
          </div>
          <button className="p-2 hover:bg-muted/50 rounded-full transition-colors relative">
            <Menu className="w-6 h-6 text-primary" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-background"></span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-6 pb-24 overflow-y-auto scrollbar-hide">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card/80 backdrop-blur-md border-t border-border/40 z-50 pb-6 pt-2 px-6">
        <ul className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <a className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
                    isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:text-primary/70"
                  )}>
                    <item.icon className={cn("w-5 h-5", isActive && "fill-current")} strokeWidth={isActive ? 2.5 : 1.5} />
                    <span className="text-[9px] font-medium">{item.label}</span>
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
