import MobileLayout from "@/components/layout/MobileLayout";
import CapitalLayerCard from "@/components/dashboard/CapitalLayerCard";
import { FUND_LAYERS } from "@/lib/mock-data";
import { AlertTriangle, TrendingUp, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const totalCapital = FUND_LAYERS.reduce((acc, layer) => acc + layer.amount, 0);

  return (
    <MobileLayout title="المجلس المالي">
      <div className="space-y-6 pt-2">
        
        {/* Total Wealth Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 py-6 bg-card/50 rounded-3xl border border-border/40 backdrop-blur-sm"
        >
          <p className="text-sm text-muted-foreground">إجمالي أصول الصندوق</p>
          <h2 className="text-4xl font-bold font-mono text-primary tracking-tighter">
            {totalCapital.toLocaleString()} <span className="text-lg text-muted-foreground font-sans">OZR</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+4.2% هذا الشهر</span>
            </div>
            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>آمن</span>
            </div>
          </div>
        </motion.div>

        {/* Safety Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
             <h4 className="text-sm font-bold text-amber-800">تذكير خط الأمان</h4>
             <p className="text-xs text-amber-700 mt-1 leading-relaxed">
               رأس مال النمو مقفل حتى يصل الصندوق إلى 120,000 OZR. التركيز الحالي على الحفاظ والتماسك.
             </p>
          </div>
        </div>

        {/* Capital Layers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-lg text-primary">هيكل رأس المال</h3>
            <span className="text-xs text-muted-foreground">القاعدة 50/20/20/10</span>
          </div>
          <div className="grid gap-4">
            {FUND_LAYERS.map((layer, idx) => (
              <CapitalLayerCard key={layer.id} layer={layer} delay={idx} />
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
