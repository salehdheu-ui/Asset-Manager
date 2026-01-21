import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { FAMILY_MEMBERS as INITIAL_MEMBERS, FamilyMember } from "@/lib/mock-data";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Edit3, 
  DollarSign,
  Search,
  History,
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

interface YearlyContribution {
  [year: number]: {
    [month: number]: number; // 1 to 12
  };
}

interface PaymentMember extends FamilyMember {
  contributions: YearlyContribution;
}

export default function YearlyPaymentMatrix() {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [members, setMembers] = useState<PaymentMember[]>(() => {
    const saved = localStorage.getItem("paymentMatrix");
    if (saved) return JSON.parse(saved);
    return INITIAL_MEMBERS.map(m => ({
      ...m,
      contributions: {
        [currentYear]: {}
      }
    }));
  });

  useEffect(() => {
    localStorage.setItem("paymentMatrix", JSON.stringify(members));
  }, [members]);

  const months = [
    { id: 1, name: "يناير" }, { id: 2, name: "فبراير" }, { id: 3, name: "مارس" },
    { id: 4, name: "أبريل" }, { id: 5, name: "مايو" }, { id: 6, name: "يونيو" },
    { id: 7, name: "يوليو" }, { id: 8, name: "أغسطس" }, { id: 9, name: "سبتمبر" },
    { id: 10, name: "أكتوبر" }, { id: 11, name: "نوفمبر" }, { id: 12, name: "ديسمبر" }
  ];

  const updatePayment = (memberId: string, year: number, month: number, amount: number) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const newContributions = { ...m.contributions };
        if (!newContributions[year]) newContributions[year] = {};
        newContributions[year][month] = amount;
        return { ...m, contributions: newContributions };
      }
      return m;
    }));
    toast({ title: `تم تحديث مبلغ شهر ${month} لعام ${year}` });
  };

  const years = Array.from({ length: currentYear - 2000 + 5 }, (_, i) => 2000 + i);

  return (
    <MobileLayout title="سجل المساهمات السنوي">
      <div className="space-y-6 pt-2 pb-12">
        
        {/* Year Selector */}
        <div className="flex items-center justify-between bg-card border border-border rounded-2xl p-4 shadow-sm">
          <button 
            onClick={() => setSelectedYear(prev => prev - 1)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground">عرض سنة</span>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent font-bold text-xl font-mono focus:outline-none appearance-none text-center cursor-pointer"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <button 
            onClick={() => setSelectedYear(prev => prev + 1)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Matrix View */}
        <div className="space-y-6">
          {members.map((member, mIdx) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mIdx * 0.05 }}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm"
            >
              {/* Member Header */}
              <div className="p-4 bg-primary/5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
                    {member.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{member.name}</h4>
                    <p className="text-[10px] text-muted-foreground">إجمالي {selectedYear}: {
                      Object.values(member.contributions[selectedYear] || {}).reduce((a, b) => a + b, 0)
                    } OZR</p>
                  </div>
                </div>
                <History className="w-4 h-4 text-primary/40" />
              </div>

              {/* Months Grid */}
              <div className="grid grid-cols-4 gap-px bg-border/40">
                {months.map((month) => {
                  const paidAmount = member.contributions[selectedYear]?.[month.id] || 0;
                  return (
                    <Dialog key={month.id}>
                      <DialogTrigger asChild>
                        <button className={cn(
                          "flex flex-col items-center justify-center p-3 gap-1 transition-colors relative group bg-card hover:bg-muted/50",
                          paidAmount > 0 ? "text-primary" : "text-muted-foreground"
                        )}>
                          <span className="text-[10px] font-medium">{month.name}</span>
                          <span className="text-xs font-mono font-bold">
                            {paidAmount > 0 ? paidAmount : "---"}
                          </span>
                          {paidAmount > 0 && (
                            <div className="absolute top-1 left-1">
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                            </div>
                          )}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md font-sans" dir="rtl">
                        <DialogHeader>
                          <DialogTitle className="font-heading text-xl">تعديل مساهمة {month.name}</DialogTitle>
                          <DialogDescription>العضو: {member.name} - سنة {selectedYear}</DialogDescription>
                        </DialogHeader>
                        <div className="py-6 space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium block">المبلغ المدفوع (OZR)</label>
                            <div className="relative">
                               <input 
                                type="number" 
                                defaultValue={paidAmount || 100}
                                id={`amount-${member.id}-${month.id}`}
                                className="w-full text-3xl font-mono p-4 border rounded-2xl text-center focus:ring-2 focus:ring-primary/20 outline-none" 
                                placeholder="0"
                              />
                              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
                            </div>
                          </div>
                          <div className="bg-muted/30 p-4 rounded-xl text-xs text-center">
                            يمكنك دفع مبالغ متقدمة أو تسوية متأخرات سابقة من هنا.
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            const val = (document.getElementById(`amount-${member.id}-${month.id}`) as HTMLInputElement).value;
                            updatePayment(member.id, selectedYear, month.id, Number(val));
                          }}
                          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg"
                        >
                          حفظ وتوثيق المساهمة
                        </button>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend/Info */}
        <div className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            تتيح هذه الواجهة عرض المساهمات لكافة الأعضاء موزعة على أشهر السنة. يمكنك العودة للأعوام السابقة (منذ 2000) لمراجعة الأرشيف المالي أو إضافة مبالغ متقدمة للسنة القادمة.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
