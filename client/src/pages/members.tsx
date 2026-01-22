import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { FAMILY_MEMBERS as INITIAL_MEMBERS, FamilyMember } from "@/lib/mock-data";
import { UserCog, UserPlus, Trash2, Home, CreditCard, ShieldCheck, History, HandCoins } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ExtendedMember extends FamilyMember {
  totalApproved: number;
  totalPending: number;
}

export default function Members() {
  const [members, setMembers] = useState<ExtendedMember[]>(() => {
    const savedMembers = localStorage.getItem("familyMembers");
    const paymentMatrix = JSON.parse(localStorage.getItem("paymentMatrix") || "[]");
    
    const baseMembers = savedMembers ? JSON.parse(savedMembers) : INITIAL_MEMBERS;
    
    return baseMembers.map((m: FamilyMember) => {
      const paymentData = paymentMatrix.find((pm: any) => pm.id === m.id);
      let approved = 0;
      let pending = 0;
      
      if (paymentData?.contributions) {
        Object.values(paymentData.contributions).forEach((year: any) => {
          Object.values(year).forEach((item: any) => {
            if (item.status === 'approved') approved += (item.amount || 0);
            if (item.status === 'pending_approval') pending += (item.amount || 0);
          });
        });
      }
      
      return { ...m, totalApproved: approved, totalPending: pending };
    });
  });
  
  const { toast } = useToast();

  const addMember = () => {
    const newId = Date.now().toString();
    const newMember: ExtendedMember = {
      id: newId,
      name: "عضو جديد",
      role: 'member',
      avatar: "New",
      contributionStatus: 'pending',
      totalApproved: 0,
      totalPending: 0
    };
    const updated = [...members, newMember];
    setMembers(updated);
    localStorage.setItem("familyMembers", JSON.stringify(updated.map(({totalApproved, totalPending, ...m}) => m)));
    toast({ title: "تمت إضافة عضو جديد" });
  };

  const removeMember = (id: string) => {
    if (members.length <= 1) return;
    const updated = members.filter(m => m.id !== id);
    setMembers(updated);
    localStorage.setItem("familyMembers", JSON.stringify(updated.map(({totalApproved, totalPending, ...m}) => m)));
    toast({ title: "تم حذف العضو" });
  };

  return (
    <MobileLayout title="إدارة أفراد العائلة">
      <div className="space-y-6 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-lg text-primary font-heading">قائمة الأعضاء</h3>
          <button 
            onClick={addMember}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة عضو</span>
          </button>
        </div>

        <div className="grid gap-4 pb-12">
          {members.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border border-border rounded-[1.5rem] p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary border-2 border-primary/5">
                  {member.avatar || member.name.substring(0, 2)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg leading-none mb-1">{member.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                      member.role === 'guardian' ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-border text-muted-foreground"
                    )}>
                      {member.role === 'guardian' ? 'الوصي' : member.role === 'custodian' ? 'الأمين' : 'عضو'}
                    </span>
                    {member.totalPending > 0 && (
                      <span className="text-[8px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
                        بانتظار الموافقة
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => removeMember(member.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors bg-muted/30 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/40">
                <div className="bg-emerald-500/5 rounded-2xl p-3 border border-emerald-500/10">
                  <p className="text-[9px] text-emerald-700 font-bold mb-1">إجمالي المساهمات</p>
                  <div className="text-lg font-bold font-mono text-emerald-600">
                    {member.totalApproved.toLocaleString()} <span className="text-[10px] font-sans">ر.ع</span>
                  </div>
                </div>
                <div className="bg-amber-500/5 rounded-2xl p-3 border border-amber-500/10">
                  <p className="text-[9px] text-amber-700 font-bold mb-1">مبالغ قيد الانتظار</p>
                  <div className="text-lg font-bold font-mono text-amber-600">
                    {member.totalPending.toLocaleString()} <span className="text-[10px] font-sans">ر.ع</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1">
                <div className="flex items-center gap-1">
                  <History className="w-3 h-3" />
                  <span>آخر نشاط: {new Date().toLocaleDateString('ar-OM')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3" />
                  <span>عضوية نشطة</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
