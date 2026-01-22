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
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">عرض سنة</span>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent font-bold text-2xl font-mono focus:outline-none appearance-none text-center cursor-pointer text-primary"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <button 
            onClick={() => setSelectedYear(prev => prev + 1)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Matrix View */}
        <div className="space-y-6">
          {members.map((member, mIdx) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mIdx * 0.05 }}
              className="bg-card border border-border/60 rounded-[1.5rem] overflow-hidden shadow-sm"
            >
              {/* Member Header */}
              <div className="p-4 bg-primary/5 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
                    {member.avatar || member.name.substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{member.name}</h4>
                    <p className="text-[10px] text-muted-foreground font-bold">المعتمد: {
                      Object.values(member.contributions[selectedYear] || {})
                        .filter(c => c.status === 'approved')
                        .reduce((a, b) => a + b.amount, 0)
                    } ر.ع</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   {Object.values(member.contributions[selectedYear] || {}).some(c => c.status === 'pending_approval') && (
                     <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-100 border border-amber-200">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                        <span className="text-[8px] font-bold text-amber-700">تنبيه</span>
                     </div>
                   )}
                   <History className="w-4 h-4 text-primary/40" />
                </div>
              </div>

              {/* Months Grid - Redesigned */}
              <div className="grid grid-cols-3 gap-px bg-border/40 p-1">
                {months.map((month) => {
                  const contribution = member.contributions[selectedYear]?.[month.id];
                  const isPending = contribution?.status === 'pending_approval';
                  const isApproved = contribution?.status === 'approved';
                  const amount = contribution?.amount || 0;

                  return (
                    <Dialog key={month.id}>
                      <DialogTrigger asChild>
                        <button className={cn(
                          "flex flex-col items-center justify-center p-4 gap-1 transition-all relative group rounded-xl",
                          isApproved ? "bg-emerald-500/10 border-emerald-500/20" : isPending ? "bg-amber-500/10 border-amber-500/20" : "bg-card hover:bg-muted/50"
                        )}>
                          <span className="text-[10px] font-bold text-muted-foreground">{month.name}</span>
                          <span className={cn(
                            "text-sm font-mono font-bold",
                            isApproved ? "text-emerald-700" : isPending ? "text-amber-700" : "text-muted-foreground"
                          )}>
                            {amount > 0 ? amount : "---"}
                          </span>
                          {isApproved && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            </div>
                          )}
                          {isPending && (
                            <div className="absolute top-2 right-2">
                              <Clock className="w-3 h-3 text-amber-600" />
                            </div>
                          )}
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md font-sans" dir="rtl">
                        <DialogHeader>
                          <DialogTitle className="font-heading text-xl font-bold">
                            {isApproved ? "تم تأكيد المساهمة" : isPending ? "طلب قيد الانتظار" : "تقديم طلب مساهمة"}
                          </DialogTitle>
                          <DialogDescription className="font-medium">
                            العضو: {member.name} - {month.name} {selectedYear}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="py-6 space-y-4">
                          {isApproved ? (
                            <div className="bg-emerald-50 text-emerald-800 p-8 rounded-[2rem] flex flex-col items-center gap-3 text-center border border-emerald-100">
                              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                              <div className="text-4xl font-mono font-bold tracking-tighter">{amount} <span className="text-base font-sans font-normal">ر.ع</span></div>
                              <p className="text-sm font-bold opacity-80">تم الاعتماد والتوثيق</p>
                            </div>
                          ) : isPending ? (
                            <div className="space-y-4">
                              <div className="bg-amber-50 text-amber-800 p-8 rounded-[2rem] flex flex-col items-center gap-3 text-center border border-amber-100">
                                <Clock className="w-16 h-16 text-amber-500" />
                                <div className="text-4xl font-mono font-bold tracking-tighter">{amount} <span className="text-base font-sans font-normal">ر.ع</span></div>
                                <p className="text-sm font-bold opacity-80">بانتظار تأكيد الوصي</p>
                              </div>
                              
                              {isGuardian && (
                                <button 
                                  onClick={() => approvePayment(member.id, selectedYear, month.id)}
                                  className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-lg active:scale-95"
                                >
                                  <UserCheck className="w-6 h-6" />
                                  اعتماد استلام المبلغ
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-6">
                              <div className="space-y-3">
                                <label className="text-sm font-bold block text-muted-foreground mr-1">المبلغ المراد دفعه</label>
                                <div className="relative">
                                   <input 
                                    type="number" 
                                    defaultValue={100}
                                    id={`amount-${member.id}-${month.id}`}
                                    className="w-full text-4xl font-mono p-6 border-2 border-primary/10 rounded-3xl text-center focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
                                    placeholder="0"
                                  />
                                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">ر.ع</div>
                                </div>
                              </div>
                              <div className="bg-primary/5 p-5 rounded-2xl text-xs flex gap-3 items-start border border-primary/10">
                                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <p className="leading-relaxed font-medium">سيتم إرسال طلب للوصي لتأكيد وصول المبلغ. لن يظهر المبلغ في الرصيد الإجمالي إلا بعد الموافقة الرسمية.</p>
                              </div>
                              <button 
                                onClick={() => {
                                  const val = (document.getElementById(`amount-${member.id}-${month.id}`) as HTMLInputElement).value;
                                  submitPaymentRequest(member.id, selectedYear, month.id, Number(val));
                                }}
                                className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-lg active:scale-95"
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
      </div>
    </MobileLayout>
  );
}
