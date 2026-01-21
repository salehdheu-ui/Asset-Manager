import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { FAMILY_MEMBERS as INITIAL_MEMBERS, FamilyMember } from "@/lib/mock-data";
import { 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  Bell, 
  DollarSign,
  TrendingDown,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

interface ArrearsMember extends FamilyMember {
  monthlyAmount: number;
  arrears: number;
}

export default function PaymentList() {
  const { toast } = useToast();
  const [members, setMembers] = useState<ArrearsMember[]>(() => {
    const saved = localStorage.getItem("paymentMembers");
    if (saved) return JSON.parse(saved);
    return INITIAL_MEMBERS.map(m => ({
      ...m,
      monthlyAmount: 100,
      arrears: m.contributionStatus === 'pending' ? 100 : 0
    }));
  });

  useEffect(() => {
    localStorage.setItem("paymentMembers", JSON.stringify(members));
  }, [members]);

  const updateMonthlyAmount = (id: string, amount: number) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, monthlyAmount: amount } : m));
    toast({ title: "تم تحديث مبلغ المساهمة" });
  };

  const markAsPaid = (id: string) => {
    setMembers(prev => prev.map(m => 
      m.id === id ? { ...m, contributionStatus: 'paid', arrears: 0 } : m
    ));
    toast({ title: "تم تسجيل الدفع بنجاح" });
  };

  const today = new Date();
  const isAfter20th = today.getDate() >= 20;

  return (
    <MobileLayout title="قائمة الدفع الدوري">
      <div className="space-y-6 pt-2">
        
        {/* Reminder Alert */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 rounded-2xl border flex items-start gap-3",
            isAfter20th ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-blue-50 border-blue-200 text-blue-800"
          )}
        >
          <Bell className={cn("w-5 h-5 shrink-0 mt-0.5", isAfter20th && "animate-bounce")} />
          <div className="text-xs leading-relaxed">
            <p className="font-bold mb-1">تذكير الدفع الشهري</p>
            {isAfter20th 
              ? "نحن الآن بعد تاريخ 20 من الشهر. يرجى التأكد من تحصيل جميع المساهمات لتجنب المتأخرات."
              : "يصل تذكير الدفع لجميع الأعضاء في تاريخ 20 من كل شهر ميلادي."}
          </div>
        </motion.div>

        {/* Arrears Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] text-muted-foreground mb-1">إجمالي المحصل</p>
            <h4 className="text-xl font-bold font-mono text-primary">
              {members.filter(m => m.contributionStatus === 'paid').length * 100} <span className="text-[10px]">OZR</span>
            </h4>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <p className="text-[10px] text-muted-foreground mb-1">إجمالي المتأخرات</p>
            <h4 className="text-xl font-bold font-mono text-destructive">
              {members.reduce((acc, m) => acc + m.arrears, 0)} <span className="text-[10px]">OZR</span>
            </h4>
          </div>
        </div>

        {/* Payment Management List */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-primary px-1">حالة دفع الأعضاء</h3>
          <div className="grid gap-3">
            {members.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-primary border border-primary/10">
                      {member.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{member.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        {member.contributionStatus === 'paid' ? (
                          <span className="text-[9px] text-emerald-600 flex items-center gap-1 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> تم الدفع
                          </span>
                        ) : (
                          <span className="text-[9px] text-amber-600 flex items-center gap-1 font-medium bg-amber-50 px-1.5 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" /> بانتظار الدفع
                          </span>
                        )}
                        {member.arrears > 0 && (
                          <span className="text-[9px] text-destructive bg-destructive/10 px-1.5 py-0.5 rounded-full font-bold">
                            متأخرات: {member.arrears}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4 text-primary" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md font-sans" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="font-heading text-xl">تعديل المساهمة: {member.name}</DialogTitle>
                        <DialogDescription>تعديل مبلغ المساهمة الشهرية وتوثيق الدفع</DialogDescription>
                      </DialogHeader>
                      <div className="py-6 space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">المبلغ الشهري (OZR)</label>
                          <input 
                            type="number" 
                            value={member.monthlyAmount}
                            onChange={(e) => updateMonthlyAmount(member.id, Number(e.target.value))}
                            className="w-full text-2xl font-mono p-3 border rounded-xl text-center focus:ring-2 focus:ring-primary/20 outline-none" 
                          />
                        </div>
                        <div className="bg-destructive/5 p-4 rounded-xl border border-destructive/10">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-destructive font-bold">المتأخرات الحالية:</span>
                            <span className="font-mono font-bold text-lg">{member.arrears} OZR</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => markAsPaid(member.id)}
                          className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                        >
                          تسجيل كـ "تم الدفع"
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/40 pt-2">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span>المبلغ الشهري: {member.monthlyAmount} OZR</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>آخر دفع: {member.lastContribution || "---"}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-2xl flex items-start gap-3">
          <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            ملاحظة: النظام يقوم آلياً باحتساب المتأخرات في حال عدم تسجيل الدفع قبل نهاية الشهر. يتم إرسال إشعار لكافة الأعضاء في يوم 20 من كل شهر.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
