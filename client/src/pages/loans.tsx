import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { HandCoins, Clock, AlertCircle, CheckCircle2, History, UserCheck, Trash2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { CURRENT_USER } from "@/lib/mock-data";

interface LoanRequest {
  id: string;
  type: 'urgent' | 'emergency' | 'standard';
  title: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  memberName: string;
}

export default function Loans() {
  const { toast } = useToast();
  const isGuardian = CURRENT_USER.role === 'guardian';
  
  const [loans, setLoans] = useState<LoanRequest[]>(() => {
    const saved = localStorage.getItem("familyLoans");
    return saved ? JSON.parse(saved) : [];
  });

  const [availableCapital, setAvailableCapital] = useState(0);

  useEffect(() => {
    localStorage.setItem("familyLoans", JSON.stringify(loans));
    
    // Update available flexible capital from dashboard logic
    const fundLayers = JSON.parse(localStorage.getItem("fundLayers") || "[]");
    const flexible = fundLayers.find((l: any) => l.id === 'flexible');
    if (flexible) setAvailableCapital(flexible.amount);
  }, [loans]);

  const submitLoanRequest = (type: any, title: string, amount: number) => {
    const newLoan: LoanRequest = {
      id: Date.now().toString(),
      type,
      title,
      amount,
      status: 'pending',
      date: new Date().toLocaleDateString('ar-OM'),
      memberName: CURRENT_USER.name
    };
    setLoans([newLoan, ...loans]);
    toast({ 
      title: "تم تقديم طلب السلفة",
      description: "بانتظار مراجعة واعتماد الوصي."
    });
  };

  const approveLoan = (id: string) => {
    setLoans(prev => prev.map(l => l.id === id ? { ...l, status: 'approved' } : l));
    toast({ title: "تم اعتماد السلفة بنجاح" });
  };

  const rejectLoan = (id: string) => {
    setLoans(prev => prev.map(l => l.id === id ? { ...l, status: 'rejected' } : l));
    toast({ title: "تم رفض الطلب" });
  };

  const deleteLoan = (id: string) => {
    setLoans(prev => prev.filter(l => l.id !== id));
    toast({ title: "تم حذف السجل" });
  };

  const loanTypes = [
    {
      id: 'urgent',
      title: 'سلفة عاجلة',
      description: 'للمتطلبات السريعة والبسيطة.',
      maxAmount: '10% من الصندوق',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: Clock,
      features: ['موافقة فورية', 'مراجعة بعد 30 يوم', 'من رأس المال المرن']
    },
    {
      id: 'standard',
      title: 'سلفة غير عاجلة',
      description: 'للمشاريع الشخصية أو التحسينات.',
      maxAmount: '10% من الصندوق',
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: HandCoins,
      features: ['فترة تفكير 48 ساعة', 'تصويت العائلة', 'خطة سداد ميسرة']
    },
    {
      id: 'emergency',
      title: 'قرض طارئ',
      description: 'للأزمات الصحية أو الكوارث فقط.',
      maxAmount: '20% من الصندوق',
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: AlertCircle,
      features: ['موافقة الوصي فقط', 'من احتياطي الطوارئ', 'تسجيل فوري']
    }
  ];

  return (
    <MobileLayout title="نظام السلف">
      <div className="space-y-6 pt-2 pb-12">
        {/* Header Summary */}
        <div className="bg-primary text-primary-foreground p-6 rounded-[2rem] relative overflow-hidden shadow-lg shadow-primary/20">
          <div className="relative z-10">
            <h2 className="text-sm font-medium opacity-80 mb-1">المتاح للإقراض الآن</h2>
            <div className="text-4xl font-mono font-bold tracking-tighter">
              {availableCapital.toLocaleString()} <span className="text-lg font-sans font-normal opacity-80 text-white/90">ر.ع</span>
            </div>
            <p className="text-[10px] opacity-70 mt-3 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3" />
              يتم الصرف من رأس المال المرن واحتياطي الطوارئ
            </p>
          </div>
          <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Action Buttons (New Requests) */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-primary px-1 font-heading">تقديم طلب جديد</h3>
          <div className="grid gap-3">
            {loanTypes.map((loan) => (
              <Dialog key={loan.id}>
                <DialogTrigger asChild>
                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "p-5 rounded-2xl border flex items-start gap-4 cursor-pointer transition-all hover:shadow-md", 
                      loan.color
                    )}
                  >
                    <div className="bg-white/60 p-3 rounded-xl shrink-0">
                      <loan.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-base leading-none mb-1">{loan.title}</h4>
                        <span className="text-[9px] bg-white/80 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          حتى {loan.maxAmount}
                        </span>
                      </div>
                      <p className="text-xs opacity-80 mt-1 mb-3 leading-relaxed">{loan.description}</p>
                      <ul className="flex flex-wrap gap-2">
                        {loan.features.map((feature, i) => (
                          <li key={i} className="text-[9px] flex items-center gap-1 font-bold opacity-70">
                            <CheckCircle2 className="w-2.5 h-2.5" /> {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md font-sans" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-xl font-bold">{loan.title}</DialogTitle>
                    <DialogDescription className="font-medium">
                       يرجى تحديد المبلغ المطلوب. سيتم تسجيل هذا الطلب في السجل الدائم.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-6 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold block text-muted-foreground mr-1">المبلغ المطلوب</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          id={`loan-amount-${loan.id}`}
                          className="w-full text-4xl font-mono p-6 border-2 border-primary/10 rounded-3xl text-center focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
                          placeholder="000"
                        />
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-bold text-lg">ر.ع</div>
                      </div>
                    </div>
                    <div className="bg-muted/30 p-4 rounded-2xl text-xs text-muted-foreground space-y-2 border border-border/50 font-medium">
                      <p>• المال وسيلة لخدمة العائلة، وليس غاية.</p>
                      <p>• بتقديمك لهذا الطلب، أنت تتعهد بالمسؤولية تجاه مستقبل العائلة.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const amount = (document.getElementById(`loan-amount-${loan.id}`) as HTMLInputElement).value;
                      if (amount) submitLoanRequest(loan.id as any, loan.title, Number(amount));
                    }}
                    className="w-full bg-primary text-primary-foreground py-5 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-lg active:scale-95"
                  >
                    تأكيد وإرسال الطلب
                  </button>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>

        {/* Requests List (Ledger) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-lg text-primary font-heading">تاريخ الطلبات</h3>
            <History className="w-5 h-5 text-primary/30" />
          </div>
          
          <div className="space-y-3">
            {loans.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-3xl border border-dashed border-border">
                <p className="text-sm text-muted-foreground font-medium">لا توجد طلبات قائمة حالياً</p>
              </div>
            ) : (
              loans.map((loan) => (
                <motion.div
                  key={loan.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card border border-border/60 rounded-2xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        loan.status === 'approved' ? "bg-emerald-100 text-emerald-600" :
                        loan.status === 'rejected' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
                      )}>
                        <HandCoins className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm leading-none">{loan.title}</h4>
                        <p className="text-[10px] text-muted-foreground mt-1 font-medium">{loan.memberName} • {loan.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-mono font-bold text-primary">
                        {loan.amount.toLocaleString()} <span className="text-[10px] font-sans">ر.ع</span>
                      </div>
                      <div className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 uppercase",
                        loan.status === 'approved' ? "bg-emerald-500/10 text-emerald-700" :
                        loan.status === 'rejected' ? "bg-red-500/10 text-red-700" : "bg-amber-500/10 text-amber-700"
                      )}>
                        {loan.status === 'approved' ? 'معتمد' : loan.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                      </div>
                    </div>
                  </div>

                  {isGuardian && loan.status === 'pending' && (
                    <div className="flex gap-2 pt-1 border-t border-border/40">
                      <button 
                        onClick={() => approveLoan(loan.id)}
                        className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        اعتماد
                      </button>
                      <button 
                        onClick={() => rejectLoan(loan.id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                      >
                        <X className="w-3.5 h-3.5" />
                        رفض
                      </button>
                    </div>
                  )}

                  {loan.status !== 'pending' && (
                    <button 
                      onClick={() => deleteLoan(loan.id)}
                      className="w-full text-[10px] text-muted-foreground flex items-center justify-center gap-1 pt-2 border-t border-border/40 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> حذف السجل
                    </button>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
