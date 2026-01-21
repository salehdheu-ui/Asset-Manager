import MobileLayout from "@/components/layout/MobileLayout";
import { FAMILY_MEMBERS } from "@/lib/mock-data";
import { User, CheckCircle2, Clock, CalendarDays, Wallet, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Members() {
  return (
    <MobileLayout title="أعضاء العائلة">
      <div className="space-y-6 pt-2">
        
        {/* Monthly Contribution Status Summary */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-primary">المساهمات الدورية</h3>
            <p className="text-xs text-muted-foreground mt-1">مايو 2024</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold font-mono text-primary">3/5</span>
            <p className="text-[10px] text-muted-foreground">تم الدفع</p>
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-primary px-1">القائمة</h3>
          <div className="grid gap-3">
            {FAMILY_MEMBERS.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-card border border-border rounded-2xl p-4 shadow-sm flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-primary border border-primary/10">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold">{member.name}</h4>
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded-full font-medium border",
                      member.role === 'guardian' ? "bg-amber-50 text-amber-700 border-amber-200" :
                      member.role === 'custodian' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                      "bg-blue-50 text-blue-700 border-blue-200"
                    )}>
                      {member.role === 'guardian' ? 'وصي' : member.role === 'custodian' ? 'أمين' : 'عضو'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {member.contributionStatus === 'paid' ? (
                      <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> تم دفع المساهمة
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> بانتظار المساهمة
                      </span>
                    )}
                  </div>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                      <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md font-sans" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-xl">المساهمة الدورية</DialogTitle>
                      <DialogDescription>
                        توثيق عملية دفع المساهمة الشهرية للعضو {member.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-4">
                       <div className="bg-muted/30 p-4 rounded-xl flex items-center justify-between">
                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <CalendarDays className="w-4 h-4" />
                           <span>شهر المساهمة</span>
                         </div>
                         <span className="font-bold">مايو 2024</span>
                       </div>
                       <div className="space-y-2">
                         <label className="text-sm font-medium">المبلغ المتفق عليه (OZR)</label>
                         <div className="flex items-center gap-3">
                           <input 
                             type="number" 
                             defaultValue="100"
                             className="flex-1 text-2xl font-mono p-3 border rounded-xl text-center focus:ring-2 focus:ring-primary/20 outline-none" 
                           />
                           <Wallet className="w-6 h-6 text-primary" />
                         </div>
                       </div>
                    </div>
                    <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors">
                      تأكيد الاستلام والتوثيق
                    </button>
                  </DialogContent>
                </Dialog>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 leading-relaxed">
            المساهمات الدورية تعزز من "رأس المال المرن" وتساهم في زيادة قدرة الصندوق على مساعدة الأعضاء عند الحاجة.
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
