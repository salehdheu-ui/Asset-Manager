import { db } from "../db";
import { fundAdjustments, loans } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function migrateWithdrawalsToLoans(): Promise<void> {
  const withdrawals = await db
    .select()
    .from(fundAdjustments)
    .where(eq(fundAdjustments.type, "withdrawal"));

  if (withdrawals.length === 0) return;

  console.log(`[Migration] تحويل ${withdrawals.length} سحب مباشر إلى قروض غير عاجلة...`);

  for (const withdrawal of withdrawals) {
    if (!withdrawal.memberId) continue;

    await db.insert(loans).values({
      memberId: withdrawal.memberId,
      type: "standard",
      title: "سلفة غير عاجلة",
      description: withdrawal.description || undefined,
      amount: withdrawal.amount,
      status: "approved",
      repaymentType: "open",
      repaymentMonths: null,
      approvedAt: withdrawal.createdAt || new Date(),
    });

    await db.delete(fundAdjustments).where(eq(fundAdjustments.id, withdrawal.id));
  }

  console.log(`[Migration] اكتملت عملية الترحيل بنجاح.`);
}
