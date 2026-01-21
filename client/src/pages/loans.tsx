import { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { HandCoins, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

type LoanType = 'urgent' | 'emergency' | 'standard';

export default function Loans() {
  const [selectedLoan, setSelectedLoan] = useState<LoanType | null>(null);

  const loanTypes = [
    {
      id: 'urgent',
      title: 'سلفة عاجلة',
      description: 'للمتطلبات السريعة والبسيطة.',
      maxAmount: '3% من الصندوق',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: Clock,
      features: ['موافقة فورية', 'مراجعة بعد 30 يوم', 'من رأس المال المرن']
    },
    {
      id: 'standard',
      title: 'سلفة غير عاجلة',
      description: 'للمشاريع الشخصية أو التحسينات.',
      maxAmount: '6% من الصندوق',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: HandCoins,
      features: ['فترة تفكير 48 ساعة', 'تصويت العائلة', 'خطة سداد ميسرة']
    },
    {
      id: 'emergency',
      title: 'قرض طارئ',
      description: 'للأزمات الصحية أو الكوارث فقط.',
      maxAmount: '8% من الصندوق',
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: AlertCircle,
      features: ['موافقة الوصي فقط', 'من احتياطي الطوارئ', 'تسجيل فوري']
    }
  ];

  return (
    <MobileLayout title="نظام السلف">
      <div className="space-y-6 pt-2">
        <div className="bg-primary text-primary-foreground p-6 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">المتاح للإقراض</h2>
            <p className="text-3xl font-mono font-bold tracking-tight">15,400 <span className="text-sm font-sans font-normal opacity-80">OZR</span></p>
            <p className="text-xs opacity-70 mt-2">من رأس المال المرن فقط</p>
          </div>
          <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-lg text-primary px-1">أنواع الطلبات</h3>
          <div className="grid gap-4">
            {loanTypes.map((loan) => (
              <Dialog key={loan.id}>
                <DialogTrigger asChild>
                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "p-5 rounded-xl border flex items-start gap-4 cursor-pointer transition-colors hover:shadow-md", 
                      loan.color
                    )}
                  >
                    <div className="bg-white/50 p-3 rounded-full shrink-0">
                      <loan.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg">{loan.title}</h4>
                        <span className="text-[10px] bg-white/60 px-2 py-1 rounded-full font-medium">
                          حتى {loan.maxAmount}
                        </span>
                      </div>
                      <p className="text-sm opacity-80 mt-1 mb-3">{loan.description}</p>
                      <ul className="space-y-1">
                        {loan.features.map((feature, i) => (
                          <li key={i} className="text-xs flex items-center gap-1.5 opacity-90">
                            <CheckCircle2 className="w-3 h-3" /> {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md font-sans" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-xl">{loan.title}</DialogTitle>
                    <DialogDescription>
                       يرجى تأكيد طلب {loan.title}. سيتم تسجيل هذا الطلب في سجل الثقة.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <label className="text-sm font-medium mb-2 block">المبلغ المطلوب (OZR)</label>
                    <input 
                      type="number" 
                      className="w-full text-2xl font-mono p-3 border rounded-xl text-center focus:ring-2 focus:ring-primary/20 outline-none" 
                      placeholder="000"
                    />
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg text-xs text-muted-foreground space-y-2">
                    <p>• المال وسيلة لخدمة العائلة، وليس غاية.</p>
                    <p>• بتقديمك لهذا الطلب، أنت تتعهد بالمسؤولية تجاه مستقبل العائلة.</p>
                  </div>
                  <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors mt-2">
                    تأكيد الطلب
                  </button>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
