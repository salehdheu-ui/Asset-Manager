import type { RequestHandler } from "express";
import { storage } from "./storage";

// عند تفعيل وضع الطوارئ تُجمَّد العمليات المالية للأعضاء؛ المدير (الوصي) يحتفظ بصلاحياته
export const blockMembersDuringEmergency: RequestHandler = async (req, res, next) => {
  try {
    if (req.user?.role === "admin") {
      return next();
    }
    const settings = await storage.getFamilySettings();
    if (settings?.emergencyMode) {
      return res.status(423).json({
        message: "وضع الطوارئ مفعّل — العمليات المالية مجمّدة مؤقتاً بقرار من الوصي",
      });
    }
    next();
  } catch (error) {
    console.error("Emergency mode check error:", error);
    res.status(500).json({ message: "حدث خطأ" });
  }
};
