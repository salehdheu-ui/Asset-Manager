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
      className="relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm p-5 hover:shadow-md transition-shadow group"
    >
      <div className={cn("absolute top-0 right-0 w-1.5 h-full opacity-80", layer.color)} />
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-foreground font-heading">{layer.arabicName}</h3>
          <p className="text-xs text-muted-foreground font-sans">{layer.name}</p>
        </div>
        <div className={cn(
          "p-2 rounded-full bg-muted/30", 
          layer.locked ? "text-muted-foreground" : "text-primary"
        )}>
          {layer.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <div className="text-3xl font-bold font-mono tracking-tight text-primary">
          {layer.amount.toLocaleString()} <span className="text-sm font-sans font-normal text-muted-foreground">OZR</span>
        </div>
        <div className="text-xs text-muted-foreground">{layer.description}</div>
      </div>

      <div className="w-full bg-muted/50 h-2 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${layer.percentage}%` }}
          transition={{ duration: 1, delay: 0.5 + (delay * 0.1) }}
          className={cn("h-full rounded-full opacity-90", layer.color)} 
        />
      </div>
      <div className="flex justify-between mt-2 text-xs font-medium text-muted-foreground">
        <span>الهدف: {layer.percentage}%</span>
        <span>الحالة: {layer.locked ? "مقفل" : "نشط"}</span>
      </div>
    </motion.div>
  );
}
