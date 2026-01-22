import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { FAMILY_MEMBERS as INITIAL_MEMBERS, CURRENT_USER, FamilyMember } from "@/lib/mock-data";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  History,
  Info,
  UserCheck,
  AlertCircle
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
    [month: number]: {
      amount: number;
      status: 'pending_approval' | 'approved';
      timestamp: string;
    };
  };
}

interface PaymentMember extends FamilyMember {
  contributions: YearlyContribution;
}

export default function YearlyPaymentMatrix() {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const isGuardian = CURRENT_USER.role === 'guardian';
  
  const [members, setMembers] = useState<PaymentMember[]>(() => {
    const saved = localStorage.getItem("paymentMatrix");
    if (saved) return JSON.parse(saved);
    
    // Initialize with members from local storage if available
    const storedMembers = JSON.parse(localStorage.getItem("familyMembers") || "[]");
    const sourceMembers = storedMembers.length > 0 ? storedMembers : INITIAL_MEMBERS;
    
    return sourceMembers.map(m => ({
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

  const submitPaymentRequest = (memberId: string, year: number, month: number, amount: number) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const newContributions = { ...m.contributions };
        if (!newContributions[year]) newContributions[year] = {};
        newContributions[year][month] = {
          amount,
          status: 'pending_approval',
          timestamp: new Date().toISOString()
        };
        return { ...m, contributions: newContributions };
      }
      return m;
    }));
    toast({ 
      title: "تم تقديم طلب الدفع",
      description: "بانتظار اعتماد الوصي للمبلغ."
    });
  };

  const approvePayment = (memberId: string, year: number, month: number) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const newContributions = { ...m.contributions };
        if (newContributions[year]?.[month]) {
          newContributions[year][month].status = 'approved';
        }
        return { ...m, contributions: newContributions };
      }
      return m;
    }));
    toast({ title: "تم اعتماد المساهمة بنجاح" });
  };

  const years = Array.from({ length: currentYear - 2000 + 5 }, (_, i) => 2000 + i);

  return (
    <MobileLayout title="سجل المساهمات والاعتمادات">
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
        <div className="space-y-4">
          {members.map((member, mIdx) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mIdx * 0.05 }}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm"
            >
              {/* Member Header */}
              <div className="p-3 bg-primary/5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20 text-xs">
                    {member.avatar || member.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">{member.name}</h4>
                    <p className="text-[9px] text-muted-foreground">إجمالي {selectedYear}: {
                      Object.values(member.contributions[selectedYear] || {})
                        .filter(c => c.status === 'approved')
                        .reduce((a, b) => a + b.amount, 0)
                    } ر.ع</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   {Object.values(member.contributions[selectedYear] || {}).some(c => c.status === 'pending_approval') && (
                     <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                   )}
                   <History className="w-3.5 h-3.5 text-primary/40" />
                </div>
              </div>

              {/* Months Grid */}
              <div className="grid grid-cols-4 gap-px bg-border/30">
                {months.map((month) => {
                  const contribution = member.contributions[selectedYear]?.[month.id];
                  const isPending = contribution?.status === 'pending_approval';
                  const isApproved = contribution?.status === 'approved';
                  const amount = contribution?.amount || 0;

                  return (
                    <Dialog key={month.id}>
                      <DialogTrigger asChild>
                        <button className={cn(
                          "flex flex-col items-center justify-center p-2.5 gap-0.5 transition-colors relative group bg-card hover:bg-muted/50",
                          isApproved ? "text-primary" : isPending ? "text-amber-600" : "text-muted-foreground"
                        )}>
                          <span className="text-[9px] font-medium">{month.name}</span>
                          <span className="text-[11px] font-mono font-bold">
                            {amount > 0 ? amount : "---"}
                          </span>
                          {isApproved && (
                            <div className="absolute top-1 left-1">
                              <CheckCircle2 className="w-2 h-2 text-emerald-500" />
                            </div>
                          )}
                          {isPending && (
                            <div className="absolute top-1 left-1">
                              <Clock className="w-2 h-2 text-amber-500" />
                            </div>
                          )}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md font-sans" dir="rtl">
                        <DialogHeader>
                          <DialogTitle className="font-heading text-xl">
                            {isApproved ? "تم تأكيد المساهمة" : isPending ? "طلب قيد الانتظار" : "تقديم طلب مساهمة"}
                          </DialogTitle>
                          <DialogDescription>
                            العضو: {member.name} - {month.name} {selectedYear}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="py-6 space-y-4">
                          {isApproved ? (
                            <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl flex flex-col items-center gap-3 text-center">
                              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                              <div className="text-2xl font-mono font-bold">{amount} ر.ع</div>
                              <p className="text-sm">هذه المساهمة معتمدة وموثقة في السجل.</p>
                            </div>
                          ) : isPending ? (
                            <div className="space-y-4">
                              <div className="bg-amber-50 text-amber-800 p-6 rounded-2xl flex flex-col items-center gap-3 text-center">
                                <Clock className="w-12 h-12 text-amber-500" />
                                <div className="text-2xl font-mono font-bold">{amount} ر.ع</div>
                                <p className="text-sm">بانتظار تأكيد الوصي لاستلام المبلغ.</p>
                              </div>
                              
                              {isGuardian && (
                                <button 
                                  onClick={() => approvePayment(member.id, selectedYear, month.id)}
                                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg flex items-center justify-center gap-2"
                                >
                                  <UserCheck className="w-5 h-5" />
                                  اعتماد استلام المبلغ
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium block">المبلغ المراد دفعه (ر.ع)</label>
                                <div className="relative">
                                   <input 
                                    type="number" 
                                    defaultValue={100}
                                    id={`amount-${member.id}-${month.id}`}
                                    className="w-full text-3xl font-mono p-4 border rounded-2xl text-center focus:ring-2 focus:ring-primary/20 outline-none" 
                                    placeholder="0"
                                  />
                                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">ر.ع</div>
                                </div>
                              </div>
                              <div className="bg-muted/30 p-4 rounded-xl text-xs flex gap-2 items-start">
                                <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <p>سيتم إرسال طلب للوصي لتأكيد وصول المبلغ. لن يظهر المبلغ في الرصيد إلا بعد الموافقة.</p>
                              </div>
                              <button 
                                onClick={() => {
                                  const val = (document.getElementById(`amount-${member.id}-${month.id}`) as HTMLInputElement).value;
                                  submitPaymentRequest(member.id, selectedYear, month.id, Number(val));
                                }}
                                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg"
                              >
                                تقديم طلب دفع
                              </button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Legend/Info */}
        <div className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3 shadow-sm">
          <Info className="w-5 h-5 text-primary shrink-0" />
          <div className="text-[11px] text-muted-foreground space-y-1">
            <p className="font-bold text-primary">آلية العمل الجديدة:</p>
            <p>1. يقوم العضو بتقديم طلب دفع للشهر المحدد.</p>
            <p>2. يظهر الطلب باللون الأصفر (قيد الانتظار) لدى الجميع.</p>
            <p>3. يقوم الوصي بمراجعة استلام المبلغ والضغط على "اعتماد".</p>
            <p>4. يتحول اللون للأخضر ويضاف المبلغ لصافي أصول الصندوق تلقائياً.</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
