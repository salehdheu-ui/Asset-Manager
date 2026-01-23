import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MobileLayout from "@/components/layout/MobileLayout";
import { getAdminUsers, getMembers, updateUserRole, linkUserToMember, deleteUser } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Shield, Users, Trash2, UserCheck, Link, Crown, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: allUsers = [], isLoading: usersLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
    enabled: !!user,
    retry: false,
  });

  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "تم تحديث الدور بنجاح" });
    },
    onError: () => {
      toast({ title: "فشل تحديث الدور", variant: "destructive" });
    },
  });

  const linkMemberMutation = useMutation({
    mutationFn: ({ id, memberId }: { id: string; memberId: string }) => linkUserToMember(id, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "تم ربط العضو بنجاح" });
    },
    onError: () => {
      toast({ title: "فشل ربط العضو", variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "تم حذف المستخدم" });
    },
    onError: () => {
      toast({ title: "فشل حذف المستخدم", variant: "destructive" });
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/");
    }
  }, [authLoading, user, setLocation]);

  if (authLoading || usersLoading) {
    return (
      <MobileLayout title="لوحة الإدارة">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </MobileLayout>
    );
  }

  if (error) {
    return (
      <MobileLayout title="لوحة الإدارة">
        <div className="text-center py-12 bg-red-50 rounded-3xl border border-red-200">
          <Shield className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <p className="text-red-700 font-bold">غير مصرح لك بالوصول</p>
          <p className="text-red-600 text-sm mt-2">يجب أن تكون مشرفاً للوصول لهذه الصفحة</p>
        </div>
      </MobileLayout>
    );
  }

  const getMemberName = (memberId: string | null) => {
    if (!memberId) return "غير مرتبط";
    return members.find(m => m.id === memberId)?.name || "غير معروف";
  };

  return (
    <MobileLayout title="لوحة الإدارة">
      <div className="space-y-6 pt-2 pb-12">
        
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-6 rounded-[2rem] relative overflow-hidden shadow-lg shadow-primary/20">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8" />
              <h2 className="text-xl font-bold">إدارة المستخدمين</h2>
            </div>
            <p className="text-sm opacity-80">عرض وتعديل وحذف المستخدمين المسجلين</p>
            <p className="text-xs opacity-60 mt-2">إجمالي المستخدمين: {allUsers.length}</p>
          </div>
          <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Users List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-lg text-primary font-heading">قائمة المستخدمين</h3>
            <Users className="w-5 h-5 text-primary/30" />
          </div>

          {allUsers.length === 0 ? (
            <div className="text-center py-12 bg-muted/20 rounded-3xl border border-dashed border-border">
              <p className="text-sm text-muted-foreground font-medium">لا يوجد مستخدمين مسجلين</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allUsers.map((u, idx) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card border border-border/60 rounded-[1.5rem] p-4 shadow-sm space-y-4"
                >
                  <div className="flex items-center gap-4">
                    {u.profileImageUrl ? (
                      <img 
                        src={u.profileImageUrl} 
                        alt={u.firstName || "User"} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/10"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {(u.firstName?.[0] || u.email?.[0] || "U").toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-sm leading-none">
                        {u.firstName} {u.lastName}
                      </h4>
                      <p className="text-[10px] text-muted-foreground mt-1">{u.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border flex items-center gap-1",
                          u.role === 'admin' ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-border text-muted-foreground"
                        )}>
                          {u.role === 'admin' ? <Crown className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                          {u.role === 'admin' ? 'مشرف' : 'مستخدم'}
                        </span>
                        <span className="text-[8px] text-muted-foreground">
                          العضو: {getMemberName(u.memberId)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border/40">
                    {/* Change Role */}
                    <button
                      onClick={() => updateRoleMutation.mutate({ 
                        id: u.id, 
                        role: u.role === 'admin' ? 'user' : 'admin' 
                      })}
                      disabled={updateRoleMutation.isPending}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50",
                        u.role === 'admin' ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                      )}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      {u.role === 'admin' ? 'إزالة الإدارة' : 'ترقية لمشرف'}
                    </button>

                    {/* Link to Member */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform">
                          <Link className="w-3.5 h-3.5" />
                          ربط بعضو
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md font-sans" dir="rtl">
                        <DialogHeader>
                          <DialogTitle className="font-heading text-xl">ربط المستخدم بعضو</DialogTitle>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                          <p className="text-sm text-muted-foreground">
                            اختر العضو لربطه مع {u.firstName} {u.lastName}
                          </p>
                          <div className="space-y-2">
                            {members.map(m => (
                              <button
                                key={m.id}
                                onClick={() => linkMemberMutation.mutate({ id: u.id, memberId: m.id })}
                                disabled={linkMemberMutation.isPending}
                                className="w-full p-3 bg-muted/30 hover:bg-muted rounded-xl text-right flex items-center gap-3 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                  {m.avatar || m.name.substring(0, 2)}
                                </div>
                                <span className="font-medium">{m.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Delete User */}
                    <button
                      onClick={() => {
                        if (confirm("هل أنت متأكد من حذف هذا المستخدم؟")) {
                          deleteUserMutation.mutate(u.id);
                        }
                      }}
                      disabled={deleteUserMutation.isPending || u.id === user?.id}
                      className="p-2 bg-red-600 text-white rounded-xl flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
