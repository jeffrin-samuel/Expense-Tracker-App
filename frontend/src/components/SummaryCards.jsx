import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

const CURRENCY_CONFIG = {
  INR: { symbol: '₹', locale: 'en-IN', currency: 'INR' },
  USD: { symbol: '$', locale: 'en-US', currency: 'USD' },
  EUR: { symbol: '€', locale: 'de-DE', currency: 'EUR' },
  GBP: { symbol: '£', locale: 'en-GB', currency: 'GBP' },
  JPY: { symbol: '¥', locale: 'ja-JP', currency: 'JPY' },
  AUD: { symbol: 'A$', locale: 'en-AU', currency: 'AUD' },
  CAD: { symbol: 'C$', locale: 'en-CA', currency: 'CAD' },
};

export const SummaryCards = ({ balance, income, expense, currency }) => {
  const formatCurrency = (amount) => {
    const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.INR;
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card data-testid="balance-card" className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Balance</CardTitle>
          <Wallet className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </CardHeader>
        <CardContent>
          <div data-testid="balance-amount" className="text-3xl font-bold font-mono tracking-tight">
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Current balance</p>
        </CardContent>
      </Card>

      <Card data-testid="income-card" className="border-emerald-200 dark:border-emerald-900/50 shadow-sm hover:shadow-md transition-shadow bg-emerald-50/30 dark:bg-emerald-950/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Total Income</CardTitle>
          <ArrowUpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div data-testid="income-amount" className="text-3xl font-bold font-mono tracking-tight text-emerald-700 dark:text-emerald-400">
            {formatCurrency(income)}
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-2">Total earnings</p>
        </CardContent>
      </Card>

      <Card data-testid="expense-card" className="border-rose-200 dark:border-rose-900/50 shadow-sm hover:shadow-md transition-shadow bg-rose-50/30 dark:bg-rose-950/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-rose-700 dark:text-rose-400">Total Expenses</CardTitle>
          <ArrowDownCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
        </CardHeader>
        <CardContent>
          <div data-testid="expense-amount" className="text-3xl font-bold font-mono tracking-tight text-rose-700 dark:text-rose-400">
            {formatCurrency(expense)}
          </div>
          <p className="text-xs text-rose-600 dark:text-rose-500 mt-2">Total spending</p>
        </CardContent>
      </Card>
    </div>
  );
};