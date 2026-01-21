import { useState, useEffect } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { FAMILY_MEMBERS as INITIAL_MEMBERS, CURRENT_USER as INITIAL_USER, FamilyMember } from "@/lib/mock-data";
import { UserCog, Save, UserPlus, Trash2, Home, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function FamilySettings() {
  const [familyName, setFamilyName] = useState(() => localStorage.getItem("familyName") || "عائلة السعيدي");
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    const saved = localStorage.getItem("familyMembers");
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("familyMembers", JSON.stringify(members));
    localStorage.setItem("familyName", familyName);
  }, [members, familyName]);

  const updateMemberName = (id: string, newName: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, name: newName } : m));
  };

  const addMember = () => {
    const newId = (members.length + 1).toString();
    const newMember: FamilyMember = {
      id: newId,
      name: "عضو جديد",
      role: 'member',
      avatar: "New",
      contributionStatus: 'pending'
    };
    setMembers([...members, newMember]);
    toast({ title: "تمت إضافة عضو جديد" });
  };

  const removeMember = (id: string) => {
    if (members.length <= 1) return;
    setMembers(prev => prev.filter(m => m.id !== id));
    toast({ title: "تم حذف العضو" });
  };

  return (
    <MobileLayout title="إعدادات العائلة">
      <div className="space-y-6 pt-2">
        
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Home className="w-5 h-5" />
            <h3 className="font-bold font-heading">اسم العائلة / الصندوق</h3>
          </div>
          <input
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            className="w-full text-lg font-bold p-3 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
            placeholder="مثال: عائلة السعيدي"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-lg text-primary">إدارة الأعضاء</h3>
            <button 
              onClick={addMember}
              className="p-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
            </button>
          </div>

          <div className="grid gap-3">
            {members.map((member, idx) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-primary shrink-0">
                  {member.name.substring(0, 2)}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMemberName(member.id, e.target.value)}
                    className="w-full bg-transparent font-bold focus:outline-none focus:border-b border-primary/20"
                  />
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {member.role === 'guardian' ? 'الوصي' : member.role === 'custodian' ? 'الأمين' : 'عضو'}
                  </div>
                </div>
                <button 
                  onClick={() => removeMember(member.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
          <p className="text-xs text-blue-800 leading-relaxed">
            * هذا البرنامج يعمل بشكل محلي لكل عائلة. يمكنك تغيير الأسماء والبيانات لتناسب احتياجات عائلتك الخاصة. البيانات تحفظ في متصفحك الحالي.
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
