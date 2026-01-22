import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import CapitalLayerCard from "@/components/dashboard/CapitalLayerCard";
import { FUND_LAYERS as INITIAL_LAYERS } from "@/lib/mock-data";
import { AlertTriangle, TrendingUp, ShieldCheck, Wallet, ArrowUpRight, HandCoins, Users, CreditCard, History } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [layers, setLayers] = useState(() => {
    const saved = localStorage.getItem("fundLayers");
    if (saved) return JSON.parse(saved);
    return INITIAL_LAYERS;
  });

  const [paymentMatrix, setPaymentMatrix] = useState(() => {
    const saved = localStorage.getItem("paymentMatrix");
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("familyExpenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [loans, setLoans] = useState(() => {
    const saved = localStorage.getItem("familyLoans");
    return saved ? JSON.parse(saved) : [];
  });

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem("familyMembers");
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate total ONLY from APPROVED contributions
  const totalApprovedContributions = paymentMatrix.reduce((acc: number, member: any) => {
    const memberTotal = Object.values(member.contributions || {}).reduce((yearAcc: number, year: any) => {
      return yearAcc + Object.values(year).reduce((monthAcc: number, item: any) => {
        // New structure: item is an object with { amount, status }
        if (item.status === 'approved') {
          return monthAcc + (item.amount || 0);
        }
        return monthAcc;
      }, 0);
    }, 0);
    return acc + memberTotal;
  }, 0);

  const totalExpenses = expenses.reduce((acc: number, exp: any) => acc + (exp.amount || 0), 0);
  const totalLoanOut = loans.reduce((acc: number, loan: any) => acc + (loan.amount || 0), 0);

  // Net Capital = Total Approved In - Total Out
  const netCapital = totalApprovedContributions - totalExpenses - totalLoanOut;
  const totalCapital = netCapital > 0 ? netCapital : 0;

  // Update layers based on total capital
  useEffect(() => {
    const updatedLayers = layers.map((layer: any) => ({
      ...layer,
      amount: (totalCapital * layer.percentage) / 100
    }));
    setLayers(updatedLayers);
    localStorage.setItem("fundLayers", JSON.stringify(updatedLayers));
  }, [totalCapital]);

  const quickActions = [
    { label: "المساهمات", icon: CreditCard, href: "/payments", color: "bg-emerald-500", count: paymentMatrix.length },
    { label: "الإنفاق", icon: Wallet, href: "/expenses", color: "bg-amber-500", count: expenses.length },
    { label: "السلف", icon: HandCoins, href: "/loans", color: "bg-blue-500", count: loans.length },
    { label: "الأعضاء", icon: Users, href: "/members", color: "bg-purple-500", count: members.length },
  ];

  return (
    <MobileLayout title="المجلس المالي">
      <div className="space-y-6 pt-2">
        
        {/* Total Wealth Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 py-10 bg-card border border-border/40 rounded-[2.5rem] shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <p className="text-sm text-muted-foreground font-medium">صافي الأصول المعتمدة</p>
          <h2 className="text-6xl font-bold font-mono text-primary tracking-tighter">
            {totalCapital.toLocaleString()} <span className="text-xl text-muted-foreground font-sans">ر.ع</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-700 text-[11px] font-bold flex items-center gap-1.5 border border-emerald-500/20 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>نظام الاعتمادات نشط</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <a className="flex flex-col items-center gap-2 group">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-active:scale-95",
                  action.color
                )}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">{action.label}</span>
              </a>
            </Link>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-5 flex flex-col gap-1 relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-2 opacity-5 transition-transform group-hover:scale-110">
              <TrendingUp className="w-16 h-16" />
            </div>
            <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">الإيداعات المعتمدة</span>
            <span className="text-xl font-bold font-mono text-emerald-600">
              {totalApprovedContributions.toLocaleString()} <span className="text-[10px]">ر.ع</span>
            </span>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-5 flex flex-col gap-1 relative overflow-hidden group">
            <div className="absolute -right-2 -bottom-2 opacity-5 transition-transform group-hover:scale-110">
              <History className="w-16 h-16" />
            </div>
            <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">إجمالي الخارج</span>
            <span className="text-xl font-bold font-mono text-amber-600">
              {(totalExpenses + totalLoanOut).toLocaleString()} <span className="text-[10px]">ر.ع</span>
            </span>
          </div>
        </div>

        {/* Capital Layers Section */}
        <div className="space-y-4 pb-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-lg text-primary font-heading">توزيع المحفظة الذكي</h3>
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">التقسيم 50/20/20/10</span>
          </div>
          <div className="grid gap-4">
            {layers.map((layer: any, idx: number) => (
              <CapitalLayerCard key={layer.id} layer={layer} delay={idx} />
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
