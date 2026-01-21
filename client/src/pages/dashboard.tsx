import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import CapitalLayerCard from "@/components/dashboard/CapitalLayerCard";
import { FUND_LAYERS as INITIAL_LAYERS } from "@/lib/mock-data";
import { AlertTriangle, TrendingUp, ShieldCheck, Wallet, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

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
    const saved = localStorage.getItem("familyExpenses"); // Assuming expenses might be saved
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate total from payment matrix
  const totalContributions = paymentMatrix.reduce((acc: number, member: any) => {
    const memberTotal = Object.values(member.contributions || {}).reduce((yearAcc: number, year: any) => {
      return yearAcc + Object.values(year).reduce((monthAcc: number, amount: any) => monthAcc + amount, 0);
    }, 0);
    return acc + memberTotal;
  }, 0);

  const totalCapital = totalContributions;

  // Update layers based on total capital
  useEffect(() => {
    const updatedLayers = layers.map((layer: any) => ({
      ...layer,
      amount: (totalCapital * layer.percentage) / 100
    }));
    setLayers(updatedLayers);
    localStorage.setItem("fundLayers", JSON.stringify(updatedLayers));
  }, [totalCapital]);

  return (
    <MobileLayout title="المجلس المالي">
      <div className="space-y-6 pt-2">
        
        {/* Total Wealth Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 py-8 bg-card border border-border/40 rounded-[2.5rem] shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          <p className="text-sm text-muted-foreground font-medium">إجمالي أصول الصندوق</p>
          <h2 className="text-5xl font-bold font-mono text-primary tracking-tighter">
            {totalCapital.toLocaleString()} <span className="text-xl text-muted-foreground font-sans">ر.ع</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
              <span>محدث لحظياً</span>
            </div>
            <Link href="/payments">
              <a className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center gap-1 border border-primary/20 hover:bg-primary/20 transition-colors">
                <Wallet className="w-3 h-3" />
                <span>إضافة مساهمة</span>
              </a>
            </Link>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-3xl p-4 flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground">رأس المال المرن</span>
            <span className="text-lg font-bold font-mono text-emerald-600">
              {layers.find((l: any) => l.id === 'flexible')?.amount.toLocaleString()} <span className="text-[10px]">ر.ع</span>
            </span>
          </div>
          <div className="bg-card border border-border rounded-3xl p-4 flex flex-col gap-1">
            <span className="text-[10px] text-muted-foreground">احتياطي الطوارئ</span>
            <span className="text-lg font-bold font-mono text-amber-600">
              {layers.find((l: any) => l.id === 'emergency')?.amount.toLocaleString()} <span className="text-[10px]">ر.ع</span>
            </span>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
             <h4 className="text-sm font-bold text-amber-800">تذكير خط الأمان</h4>
             <p className="text-xs text-amber-700 mt-1 leading-relaxed">
               رأس مال النمو مقفل حتى يصل الصندوق إلى 120,000 ر.ع. التركيز الحالي على بناء القاعدة الأساسية.
             </p>
          </div>
        </div>

        {/* Capital Layers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-lg text-primary font-heading">توزيع المحفظة</h3>
            <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">التقسيم الشرعي</span>
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
