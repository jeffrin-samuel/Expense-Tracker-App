const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [2, "Description must be at least 2 characters"],
      maxlength: [100, "Description cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    type: {
      type: String,
      required: [true, "Transaction type is required"],
      enum: {
        values: ["income", "expense"],
        message: "Type must be either 'income' or 'expense'",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    currency: {
      type: String,
      default: "INR",
      enum: ["INR", "USD", "EUR", "GBP", "JPY", "AUD", "CAD"],
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// Virtual: formatted amount for display
transactionSchema.virtual("formattedAmount").get(function () {
  return `${this.currency} ${this.amount.toFixed(2)}`;
});

module.exports = mongoose.model("Transaction", transactionSchema);
// ^ MongoDB will auto-create a collection named "transactions" (pluralized)