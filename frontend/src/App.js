import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { SummaryCards } from '@/components/SummaryCards';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { Header } from '@/components/Header';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { getTransactions, addTransaction, deleteTransaction } from '@/services/api';
import { toast } from 'sonner';
import '@/App.css';

function App() {
  // transactions now come from MongoDB, not localStorage
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // currency and darkMode still use localStorage (UI preferences only)
  const [currency, setCurrency] = useLocalStorage('expense-tracker-currency', 'INR');
  const [darkMode, setDarkMode] = useLocalStorage('expense-tracker-dark-mode', false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // ─── Load transactions from MongoDB on first render ───────────────────────
  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getTransactions();
      setTransactions(result.data);
    } catch (error) {
      toast.error('Failed to load transactions: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // ─── Add transaction: send to backend, then update state ─────────────────
  const handleAddTransaction = async (transaction) => {
    try {
      const result = await addTransaction({ ...transaction, currency });
      // Prepend the saved transaction (with real MongoDB _id) to the list
      setTransactions((prev) => [result.data, ...prev]);
    } catch (error) {
      toast.error('Failed to add transaction: ' + error.message);
      throw error; // re-throw so TransactionForm can handle its own state
    }
  };

  // ─── Delete transaction: call backend, then remove from state ─────────────
  const handleDeleteTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => (t._id || t.id) !== id));
    } catch (error) {
      toast.error('Failed to delete transaction: ' + error.message);
    }
  };

  const { balance, totalIncome, totalExpense } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { balance: income - expense, totalIncome: income, totalExpense: expense };
  }, [transactions]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12">
        <Header
          currency={currency}
          onCurrencyChange={setCurrency}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />

        <div className="space-y-8 mt-8">
          <SummaryCards
            balance={balance}
            income={totalIncome}
            expense={totalExpense}
            currency={currency}
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 lg:col-span-3">
              <TransactionForm
                onAddTransaction={handleAddTransaction}
                currency={currency}
              />
            </div>

            <div className="md:col-span-8 lg:col-span-9">
              {loading ? (
                <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
                  Loading transactions...
                </div>
              ) : (
                <TransactionList
                  transactions={transactions}
                  onDeleteTransaction={handleDeleteTransaction}
                  currency={currency}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;