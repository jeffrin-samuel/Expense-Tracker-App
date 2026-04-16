const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Transaction = require("../models/Transaction");

// GET all transactions
router.get("/", async (req, res, next) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json({ success: true, data: transactions });
  } catch (err) {
    next(err);
  }
});

// GET stats summary
router.get("/stats/summary", async (req, res, next) => {
  try {
    const transactions = await Transaction.find();
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    res.json({
      success: true,
      data: { income, expense, balance: income - expense, count: transactions.length },
    });
  } catch (err) {
    next(err);
  }
});

// POST create transaction
router.post(
  "/",
  [
    body("description").trim().isLength({ min: 2, max: 100 }).withMessage("Description must be 2–100 chars"),
    body("amount").isFloat({ gt: 0 }).withMessage("Amount must be > 0"),
    body("type").isIn(["income", "expense"]).withMessage("Type must be income or expense"),
    body("category").notEmpty().withMessage("Category is required"),
    body("date").isISO8601().withMessage("Valid date required"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400);
      return next(new Error(errors.array().map(e => e.msg).join(", ")));
    }
    try {
      const transaction = await Transaction.create(req.body);
      res.status(201).json({ success: true, data: transaction });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE transaction
router.delete("/:id", async (req, res, next) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      res.status(404);
      return next(new Error("Transaction not found"));
    }
    res.json({ success: true, message: "Transaction deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;