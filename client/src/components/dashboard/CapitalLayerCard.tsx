import { FundLayer } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";

interface CapitalLayerCardProps {
  layer: FundLayer;
  delay?: number;
}

export default function CapitalLayerCard({ layer, delay = 0 }: CapitalLayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="relative overflow-hidden rounded-xl bg-card border border-border/50 shadow-sm p-4 hover:shadow-md transition-shadow group"
    >
      <div className={cn("absolute top-0 right-0 w-1 h-full opacity-80", layer.color)} />
      
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-sm font-bold text-foreground font-heading">{layer.arabicName}</h3>
          <p className="text-[9px] text-muted-foreground font-sans">{layer.name}</p>
        </div>
        <div className={cn(
          "p-1.5 rounded-full bg-muted/30", 
          layer.locked ? "text-muted-foreground" : "text-primary"
        )}>
          {layer.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
        </div>
      </div>

      <div className="space-y-0.5 mb-3">
        <div className="text-xl font-bold font-mono tracking-tight text-primary">
          {layer.amount.toLocaleString()} <span className="text-[10px] font-sans font-normal text-muted-foreground">ر.ع</span>
        </div>
        <div className="text-[10px] text-muted-foreground leading-tight">{layer.description}</div>
      </div>

      <div className="w-full bg-muted/50 h-1.5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${layer.percentage}%` }}
          transition={{ duration: 1, delay: 0.5 + (delay * 0.1) }}
          className={cn("h-full rounded-full opacity-90", layer.color)} 
        />
      </div>
      <div className="flex justify-between mt-1.5 text-[9px] font-medium text-muted-foreground">
        <span>الهدف: {layer.percentage}%</span>
        <span>الحالة: {layer.locked ? "مقفل" : "نشط"}</span>
      </div>
    </motion.div>
  );
}
