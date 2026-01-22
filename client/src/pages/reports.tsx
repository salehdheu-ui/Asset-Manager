import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { CURRENT_USER } from "@/lib/mock-data";
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  User,
  PieChart,
  ChevronDown,
  ChevronUp,
  CreditCard,
  HandCoins,
  Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: 'contribution' | 'expense' | 'loan';
  title: string;
  amount: number;
  date: string;
  memberName: string;
  status: string;
}

export default function Reports() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [membersData, setMembersData] = useState<any[]>([]);
  const [expandedLoan, setExpandedLoan] = useState<string | null>(null);

  useEffect(() => {
    const paymentMatrix = JSON.parse(localStorage.getItem("paymentMatrix") || "[]");
    const expenses = JSON.parse(localStorage.getItem("familyExpenses") || "[]");
    const loans = JSON.parse(localStorage.getItem("familyLoans") || "[]");
    const members = JSON.parse(localStorage.getItem("familyMembers") || "[]");

    // Aggregate Transactions
    const allTx: Transaction[] = [];

    // Contributions
    paymentMatrix.forEach((m: any) => {
      if (m.contributions) {
        Object.keys(m.contributions).forEach(year => {
          Object.keys(m.contributions[year]).forEach(month => {
            const c = m.contributions[year][month];
            if (c.status === 'approved') {
              allTx.push({
                id: `c-${m.id}-${year}-${month}`,
                type: 'contribution',
                title: `مساهمة شهر ${month}`,
                amount: c.amount,
                date: `${year}/${month}/01`,
                memberName: m.name,
                status: 'معتمد'
              });
            }
          });
        });
      }
    });

    // Expenses
    expenses.forEach((e: any) => {
      allTx.push({
        id: `e-${e.id}`,
        type: 'expense',
        title: e.title,
        amount: e.amount,
        date: e.date,
        memberName: e.memberName || 'النظام',
        status: 'منفذ'
      });
    });

    // Loans
    loans.forEach((l: any) => {
      allTx.push({
        id: `l-${l.id}`,
        type: 'loan',
        title: l.title,
        amount: l.amount,
        date: l.date,
        memberName: l.memberName,
        status: l.status === 'approved' ? 'معتمد' : l.status === 'pending' ? 'قيد الانتظار' : 'مرفوض'
      });
    });

    setTransactions(allTx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    // Aggregate Member Stats
    const stats = members.map((m: any) => {
      const memberPayments = allTx.filter(t => t.type === 'contribution' && t.memberName === m.name);
      const memberLoans = allTx.filter(t => t.type === 'loan' && t.memberName === m.name && t.status === 'معتمد');
      
      return {
        ...m,
        totalPaid: memberPayments.reduce((acc, curr) => acc + curr.amount, 0),
        totalBorrowed: memberLoans.reduce((acc, curr) => acc + curr.amount, 0),
        loanCount: memberLoans.length
      };
    });
    setMembersData(stats);
  }, []);

  const calculateRepaymentPlan = (amount: number, months: number = 12) => {
    const monthly = amount / months;
    const plan = [];
    for (let i = 1; i <= months; i++) {
      plan.push({
        month: i,
        amount: monthly,
        status: i === 1 ? 'قادم' : 'مجدول'
      });
    }
    return plan;
  };

  return (
    <MobileLayout title="الكشوفات والتقارير">
      <div className="space-y-8 pt-2 pb-12">
        
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">إجمالي الإيداعات</p>
            <h4 className="text-xl font-bold font-mono text-primary mt-1">
              {transactions.filter(t => t.type === 'contribution').reduce((a, b) => a + b.amount, 0).toLocaleString()} <span className="text-xs font-sans">ر.ع</span>
            </h4>
          </div>
          <div className="bg-card border border-border rounded-3xl p-5 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 mb-3">
              <TrendingDown className="w-6 h-6" />
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">إجمالي المنصرف</p>
            <h4 className="text-xl font-bold font-mono text-primary mt-1">
              {transactions.filter(t => t.type !== 'contribution').reduce((a, b) => a + b.amount, 0).toLocaleString()} <span className="text-xs font-sans">ر.ع</span>
            </h4>
          </div>
        </div>

        {/* Members Statements */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-primary px-1 flex items-center gap-2 font-heading">
            <User className="w-5 h-5" /> كشف الأعضاء
          </h3>
          <div className="space-y-3">
            {membersData.map((m, idx) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-card border border-border/60 rounded-[1.5rem] p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/5">
                      {m.avatar || m.name.substring(0, 2)}
                    </div>
                    <h4 className="font-bold text-sm">{m.name}</h4>
                  </div>
                  <span className="text-[9px] bg-muted px-2 py-0.5 rounded-full font-bold uppercase tracking-widest text-muted-foreground">
                    {m.role === 'guardian' ? 'الوصي' : 'عضو'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-3">
                    <p className="text-[9px] text-emerald-700 font-bold mb-1">دفع إجمالي</p>
                    <div className="text-base font-bold font-mono text-emerald-600">{m.totalPaid.toLocaleString()} ر.ع</div>
                  </div>
                  <div className="bg-amber-50/50 border border-amber-100/50 rounded-2xl p-3">
                    <p className="text-[9px] text-amber-700 font-bold mb-1">تسلف إجمالي</p>
                    <div className="text-base font-bold font-mono text-amber-600">{m.totalBorrowed.toLocaleString()} ر.ع</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* All Transactions Ledger */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-primary px-1 flex items-center gap-2 font-heading">
            <FileText className="w-5 h-5" /> السجل العام للمحررات
          </h3>
          <div className="space-y-2">
            {transactions.map((t, idx) => (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border/50 rounded-2xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      t.type === 'contribution' ? "bg-emerald-100 text-emerald-600" :
                      t.type === 'loan' ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                    )}>
                      {t.type === 'contribution' ? <CreditCard className="w-5 h-5" /> :
                       t.type === 'loan' ? <HandCoins className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold leading-tight">{t.title}</h5>
                      <p className="text-[10px] text-muted-foreground font-medium mt-1">{t.memberName} • {t.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={cn(
                      "text-base font-bold font-mono tracking-tighter",
                      t.type === 'contribution' ? "text-emerald-600" : "text-primary"
                    )}>
                      {t.type === 'contribution' ? '+' : '-'}{t.amount.toLocaleString()} <span className="text-[10px] font-sans">ر.ع</span>
                    </div>
                    {t.type === 'loan' && t.status === 'معتمد' && (
                      <button 
                        onClick={() => setExpandedLoan(expandedLoan === t.id ? null : t.id)}
                        className="text-[9px] font-bold text-primary flex items-center gap-1 mt-1 mr-auto"
                      >
                        خطة السداد {expandedLoan === t.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Repayment Plan Detail */}
                <AnimatePresence>
                  {expandedLoan === t.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-bold text-muted-foreground">جدولة الأقساط (12 شهر)</span>
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {calculateRepaymentPlan(t.amount).slice(0, 4).map((step) => (
                            <div key={step.month} className="bg-muted/30 p-2 rounded-xl border border-border/30 flex justify-between items-center">
                              <div>
                                <div className="text-[8px] text-muted-foreground font-bold uppercase">القسط {step.month}</div>
                                <div className="text-xs font-bold font-mono">{step.amount.toFixed(2)} ر.ع</div>
                              </div>
                              <span className={cn(
                                "text-[7px] font-bold px-1.5 py-0.5 rounded-full",
                                step.status === 'قادم' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                              )}>
                                {step.status}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="text-[8px] text-muted-foreground text-center italic">تم عرض أول 4 أقساط فقط • الإجمالي 12 قسطاً</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
