import MobileLayout from "@/components/layout/MobileLayout";
import { Users, Shield, Vote, Scale } from "lucide-react";

export default function Governance() {
  return (
    <MobileLayout title="الحوكمة العائلية">
      <div className="space-y-6 pt-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center text-center gap-2 hover:bg-muted/5 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm">مجلس العائلة</span>
            <span className="text-xs text-muted-foreground">5 أعضاء</span>
          </div>
          
          <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col items-center text-center gap-2 hover:bg-muted/5 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm">الوصي الحالي</span>
            <span className="text-xs text-muted-foreground">أحمد السعيدي</span>
          </div>
        </div>

        <div className="space-y-4">
           <h3 className="font-bold text-lg text-primary px-1">القرارات النشطة</h3>
           
           <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
             <div className="flex justify-between items-start mb-2">
               <h4 className="font-bold">استثمار عقاري - نزوى</h4>
               <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-full">تصويت</span>
             </div>
             <p className="text-sm text-muted-foreground mb-4">
               شراء أرض تجارية في منطقة فرق. القيمة: 12,000 OZR.
             </p>
             <div className="space-y-2">
               <div className="flex justify-between text-xs mb-1">
                 <span>موافق (3)</span>
                 <span>75%</span>
               </div>
               <div className="h-2 bg-muted rounded-full overflow-hidden">
                 <div className="w-[75%] h-full bg-emerald-500" />
               </div>
             </div>
             <div className="flex gap-2 mt-4">
                <button className="flex-1 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition-colors">موافق</button>
                <button className="flex-1 py-2 rounded-lg bg-red-50 text-red-700 text-sm font-medium hover:bg-red-100 transition-colors">معترض</button>
             </div>
           </div>

           <div className="bg-card border border-border rounded-xl p-5 shadow-sm opacity-60">
             <div className="flex justify-between items-start mb-2">
               <h4 className="font-bold">تغيير الوصي</h4>
               <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">مغلق</span>
             </div>
             <p className="text-sm text-muted-foreground mb-2">
               تم التجديد لأحمد السعيدي لمدة عام إضافي.
             </p>
             <span className="text-xs text-emerald-600 flex items-center gap-1">
               <CheckCircleIcon className="w-3 h-3" />
               تم الاعتماد - 15/01/2024
             </span>
           </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
          <Scale className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <h4 className="font-bold text-amber-800 text-sm">الميثاق العائلي</h4>
            <p className="text-xs text-amber-700 mt-1">
              "المال وسيلة لخدمة صلة الرحم، وليس لقطعها. القرارات تؤخذ بالشورى، والملزم هو مصلحة الجميع."
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  );
}
