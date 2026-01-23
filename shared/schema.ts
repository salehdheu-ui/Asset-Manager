import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export auth models (required for Replit Auth)
export * from "./models/auth";

// Family Members
export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role").notNull().default("member"), // 'guardian' | 'custodian' | 'member'
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMemberSchema = createInsertSchema(members).omit({ id: true, createdAt: true });
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;

// Monthly Contributions
export const contributions = pgTable("contributions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id),
  year: integer("year").notNull(),
  month: integer("month").notNull(),
  amount: decimal("amount", { precision: 10, scale: 3 }).notNull(),
  status: text("status").notNull().default("pending_approval"), // 'pending_approval' | 'approved'
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
});

export const insertContributionSchema = createInsertSchema(contributions).omit({ id: true, createdAt: true, approvedAt: true });
export type InsertContribution = z.infer<typeof insertContributionSchema>;
export type Contribution = typeof contributions.$inferSelect;

// Loans
export const loans = pgTable("loans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  memberId: varchar("member_id").notNull().references(() => members.id),
  type: text("type").notNull(), // 'urgent' | 'standard' | 'emergency'
  title: text("title").notNull(),
  amount: decimal("amount", { precision: 10, scale: 3 }).notNull(),
  status: text("status").notNull().default("pending"), // 'pending' | 'approved' | 'rejected'
  repaymentMonths: integer("repayment_months").default(12),
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
});

export const insertLoanSchema = createInsertSchema(loans).omit({ id: true, createdAt: true, approvedAt: true });
export type InsertLoan = z.infer<typeof insertLoanSchema>;
export type Loan = typeof loans.$inferSelect;

// Loan Repayments
export const loanRepayments = pgTable("loan_repayments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanId: varchar("loan_id").notNull().references(() => loans.id),
  installmentNumber: integer("installment_number").notNull(),
  amount: decimal("amount", { precision: 10, scale: 3 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidAt: timestamp("paid_at"),
  status: text("status").notNull().default("scheduled"), // 'scheduled' | 'paid' | 'overdue'
});

export const insertLoanRepaymentSchema = createInsertSchema(loanRepayments).omit({ id: true });
export type InsertLoanRepayment = z.infer<typeof insertLoanRepaymentSchema>;
export type LoanRepayment = typeof loanRepayments.$inferSelect;

// Expenses
export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  amount: decimal("amount", { precision: 10, scale: 3 }).notNull(),
  category: text("category").notNull(), // 'zakat' | 'charity' | 'general' | 'emergency'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({ id: true, createdAt: true });
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;

// Family Settings
export const familySettings = pgTable("family_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyName: text("family_name").notNull().default("صندوق العائلة"),
  currency: text("currency").notNull().default("ر.ع"),
  protectedPercent: integer("protected_percent").notNull().default(50),
  emergencyPercent: integer("emergency_percent").notNull().default(20),
  flexiblePercent: integer("flexible_percent").notNull().default(20),
  growthPercent: integer("growth_percent").notNull().default(10),
});

export const insertFamilySettingsSchema = createInsertSchema(familySettings).omit({ id: true });
export type InsertFamilySettings = z.infer<typeof insertFamilySettingsSchema>;
export type FamilySettings = typeof familySettings.$inferSelect;
