import MobileLayout from "@/components/layout/MobileLayout";
import { Wallet, Heart, Scale, ArrowUpRight, TrendingDown } from "lucide-react";
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

export default function Expenses() {
  const sections = [
    {
      id: 'zakat',
      title: 'الزكاة',
      subtitle: 'الفريضة والمطهرة',
      description: 'حساب وإخراج الزكاة السنوية (2.5%) على الأصول الزكوية.',
      icon: Scale,
      color: 'bg-primary text-primary-foreground',
      details: 'الزكاة حق معلوم للسائل والمحروم. يتم حسابها يدوياً وتوثيقها في السجل.'
    },
    {
      id: 'charity',
      title: 'أعمال خيرية',
      subtitle: 'الصدقة والبر',
      description: 'مساهمات تطوعية لدعم المجتمع والمحتاجين.',
      icon: Heart,
      color: 'bg-emerald-600 text-white',
      details: 'بحد أقصى 3% من إجمالي الصندوق سنوياً للحفاظ على الاستدامة.'
    },
    {
      id: 'spending',
      title: 'المصروفات',
      subtitle: 'إدارة النفقات',
      description: 'تتبع مصروفات الصندوق الإدارية والتشغيلية.',
      icon: Wallet,
      color: 'bg-amber-600 text-white',
      details: 'مرتبطة بأهداف العائلة السنوية المعتمدة.'
    }
  ];

  return (
    <MobileLayout title="الإنفاق والمبرات">
      <div className="space-y-6 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 bg-card border border-border rounded-2xl p-4 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-xs text-muted-foreground">الرصيد القابل للإنفاق</p>
              <h3 className="text-2xl font-bold font-mono text-primary">8,540 ر.ع</h3>
            </div>
            <TrendingDown className="text-primary/20 w-12 h-12" />
          </div>
        </div>

        <div className="space-y-4">
          {sections.map((section, idx) => (
            <Dialog key={section.id}>
              <DialogTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("p-3 rounded-xl", section.color)}>
                      <section.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-lg">{section.title}</h4>
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-xs font-medium text-primary/70 mb-1">{section.subtitle}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{section.description}</p>
                    </div>
                  </div>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md font-sans" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="font-heading text-xl">{section.title}</DialogTitle>
                  <DialogDescription>{section.details}</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">المبلغ (ر.ع)</label>
                    <input 
                      type="number" 
                      className="w-full text-2xl font-mono p-3 border rounded-xl text-center focus:ring-2 focus:ring-primary/20 outline-none" 
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">الغرض / الملاحظات</label>
                    <textarea 
                      className="w-full text-sm p-3 border rounded-xl h-24 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                      placeholder="اكتب التفاصيل هنا لتوثيقها في السجل..."
                    />
                  </div>
                </div>
                <button className={cn("w-full py-3 rounded-xl font-bold transition-colors", section.id === 'zakat' ? 'bg-primary text-primary-foreground' : 'bg-primary/90 text-white')}>
                  اعتماد العملية وتوثيقها
                </button>
              </DialogContent>
            </Dialog>
          ))}
        </div>

        <div className="bg-muted/30 p-4 rounded-xl text-center">
          <p className="text-xs text-muted-foreground">
            جميع العمليات تخضع لرقابة السجل الدائم وتتطلب موافقة الوصي.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
