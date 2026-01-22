import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemberSchema, insertContributionSchema, insertLoanSchema, insertExpenseSchema, insertFamilySettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============= Members =============
  app.get("/api/members", async (req, res) => {
    try {
      const members = await storage.getMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch members" });
    }
  });

  app.post("/api/members", async (req, res) => {
    try {
      const data = insertMemberSchema.parse(req.body);
      const member = await storage.createMember(data);
      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create member" });
      }
    }
  });

  app.patch("/api/members/:id", async (req, res) => {
    try {
      const member = await storage.updateMember(req.params.id, req.body);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ error: "Failed to update member" });
    }
  });

  app.delete("/api/members/:id", async (req, res) => {
    try {
      await storage.deleteMember(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete member" });
    }
  });

  // ============= Contributions =============
  app.get("/api/contributions", async (req, res) => {
    try {
      const year = req.query.year ? Number(req.query.year) : undefined;
      const memberId = req.query.memberId as string | undefined;
      
      let contributions;
      if (year) {
        contributions = await storage.getContributionsByYear(year);
      } else if (memberId) {
        contributions = await storage.getContributionsByMember(memberId);
      } else {
        contributions = await storage.getContributions();
      }
      res.json(contributions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contributions" });
    }
  });

  app.post("/api/contributions", async (req, res) => {
    try {
      const data = insertContributionSchema.parse(req.body);
      const contribution = await storage.createContribution(data);
      res.status(201).json(contribution);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create contribution" });
      }
    }
  });

  app.patch("/api/contributions/:id/approve", async (req, res) => {
    try {
      const contribution = await storage.approveContribution(req.params.id);
      if (!contribution) {
        return res.status(404).json({ error: "Contribution not found" });
      }
      res.json(contribution);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve contribution" });
    }
  });

  // ============= Loans =============
  app.get("/api/loans", async (req, res) => {
    try {
      const memberId = req.query.memberId as string | undefined;
      const loans = memberId 
        ? await storage.getLoansByMember(memberId)
        : await storage.getLoans();
      res.json(loans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch loans" });
    }
  });

  app.post("/api/loans", async (req, res) => {
    try {
      const data = insertLoanSchema.parse(req.body);
      const loan = await storage.createLoan(data);
      
      // Create repayment schedule when loan is approved
      if (data.repaymentMonths && data.repaymentMonths > 0) {
        const monthlyAmount = Number(data.amount) / data.repaymentMonths;
        const repayments = [];
        const now = new Date();
        
        for (let i = 1; i <= data.repaymentMonths; i++) {
          const dueDate = new Date(now);
          dueDate.setMonth(dueDate.getMonth() + i);
          repayments.push({
            loanId: loan.id,
            installmentNumber: i,
            amount: monthlyAmount.toFixed(3),
            dueDate,
            status: "scheduled"
          });
        }
        await storage.createLoanRepayments(repayments as any);
      }
      
      res.status(201).json(loan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error(error);
        res.status(500).json({ error: "Failed to create loan" });
      }
    }
  });

  app.patch("/api/loans/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const loan = await storage.updateLoanStatus(req.params.id, status);
      if (!loan) {
        return res.status(404).json({ error: "Loan not found" });
      }
      res.json(loan);
    } catch (error) {
      res.status(500).json({ error: "Failed to update loan status" });
    }
  });

  app.delete("/api/loans/:id", async (req, res) => {
    try {
      await storage.deleteLoan(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete loan" });
    }
  });

  // Loan Repayments
  app.get("/api/loans/:id/repayments", async (req, res) => {
    try {
      const repayments = await storage.getLoanRepayments(req.params.id);
      res.json(repayments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch repayments" });
    }
  });

  app.patch("/api/repayments/:id/pay", async (req, res) => {
    try {
      const repayment = await storage.markRepaymentPaid(req.params.id);
      if (!repayment) {
        return res.status(404).json({ error: "Repayment not found" });
      }
      res.json(repayment);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark repayment as paid" });
    }
  });

  // ============= Expenses =============
  app.get("/api/expenses", async (req, res) => {
    try {
      const expenses = await storage.getExpenses();
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

  app.post("/api/expenses", async (req, res) => {
    try {
      const data = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(data);
      res.status(201).json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create expense" });
      }
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      await storage.deleteExpense(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete expense" });
    }
  });

  // ============= Family Settings =============
  app.get("/api/settings", async (req, res) => {
    try {
      let settings = await storage.getFamilySettings();
      if (!settings) {
        settings = await storage.updateFamilySettings({
          familyName: "صندوق العائلة",
          currency: "ر.ع"
        });
      }
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const settings = await storage.updateFamilySettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // ============= Dashboard Summary =============
  app.get("/api/dashboard/summary", async (req, res) => {
    try {
      const [allContributions, allLoans, allExpenses, settings] = await Promise.all([
        storage.getContributions(),
        storage.getLoans(),
        storage.getExpenses(),
        storage.getFamilySettings()
      ]);

      const approvedContributions = allContributions.filter(c => c.status === "approved");
      const approvedLoans = allLoans.filter(l => l.status === "approved");

      const totalContributions = approvedContributions.reduce((sum, c) => sum + Number(c.amount), 0);
      const totalLoans = approvedLoans.reduce((sum, l) => sum + Number(l.amount), 0);
      const totalExpenses = allExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

      const netCapital = totalContributions - totalLoans - totalExpenses;
      const capital = Math.max(0, netCapital);

      const percents = settings || { protectedPercent: 50, emergencyPercent: 20, flexiblePercent: 20, growthPercent: 10 };

      res.json({
        totalContributions,
        totalLoans,
        totalExpenses,
        netCapital: capital,
        layers: [
          { id: "protected", name: "رأس المال المحمي", percentage: percents.protectedPercent, amount: (capital * percents.protectedPercent / 100), locked: true },
          { id: "emergency", name: "احتياطي الطوارئ", percentage: percents.emergencyPercent, amount: (capital * percents.emergencyPercent / 100), locked: true },
          { id: "flexible", name: "رأس المال المرن", percentage: percents.flexiblePercent, amount: (capital * percents.flexiblePercent / 100), locked: false },
          { id: "growth", name: "رأس مال النمو", percentage: percents.growthPercent, amount: (capital * percents.growthPercent / 100), locked: true },
        ]
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard summary" });
    }
  });

  return httpServer;
}
