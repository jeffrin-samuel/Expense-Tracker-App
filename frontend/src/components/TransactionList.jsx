import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Search, Filter, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const CURRENCY_CONFIG = {
  INR: { symbol: '₹', locale: 'en-IN', currency: 'INR' },
  USD: { symbol: '$', locale: 'en-US', currency: 'USD' },
  EUR: { symbol: '€', locale: 'de-DE', currency: 'EUR' },
  GBP: { symbol: '£', locale: 'en-GB', currency: 'GBP' },
  JPY: { symbol: '¥', locale: 'ja-JP', currency: 'JPY' },
  AUD: { symbol: 'A$', locale: 'en-AU', currency: 'AUD' },
  CAD: { symbol: 'C$', locale: 'en-CA', currency: 'CAD' },
};

export const TransactionList = ({ transactions, onDeleteTransaction, currency }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const allCategories = useMemo(() => {
    const cats = new Set(transactions.map((t) => t.category));
    return Array.from(cats).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || transaction.type === filterType;
        const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory;
        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, searchQuery, filterType, filterCategory]);

  const groupedTransactions = useMemo(() => {
    const groups = {};
    filteredTransactions.forEach((transaction) => {
      const dateKey = format(new Date(transaction.date), 'MMMM dd, yyyy');
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(transaction);
    });
    return groups;
  }, [filteredTransactions]);

  // CHANGED: MongoDB uses _id, old localStorage used id — support both
  const getId = (transaction) => transaction._id || transaction.id;

  const handleDelete = (transaction) => {
    onDeleteTransaction(getId(transaction));
    toast.success(`Deleted "${transaction.description}"`);
  };

  const formatCurrency = (amount, currencyCode) => {
    const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.INR;
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card data-testid="transaction-list" className="border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Transactions</CardTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              data-testid="search-input"
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-slate-200 dark:border-slate-800"
            />
          </div>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger data-testid="filter-type-select" className="border-slate-200 dark:border-slate-800">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger data-testid="filter-category-select" className="border-slate-200 dark:border-slate-800">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div data-testid="empty-state" className="text-center py-12">
            <div className="text-slate-400 dark:text-slate-600 text-sm">
              {transactions.length === 0
                ? 'No transactions yet. Add your first transaction!'
                : 'No transactions match your filters.'}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
              <div key={date} className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 font-mono">{date}</h3>
                <div className="space-y-2">
                  {dayTransactions.map((transaction) => (
                    <div
                      key={getId(transaction)}  // CHANGED: use _id from MongoDB
                      data-testid={`transaction-item-${getId(transaction)}`}
                      className="flex items-center justify-between p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {transaction.type === 'income' ? (
                          <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-950/30">
                            <ArrowUpCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        ) : (
                          <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-950/30">
                            <ArrowDownCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {transaction.description}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                            {transaction.category}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div
                          className={`text-lg font-bold font-mono ${
                            transaction.type === 'income'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount, currency || 'INR')}
                        </div>
                        <Button
                          data-testid={`delete-transaction-${getId(transaction)}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(transaction)}  // CHANGED: pass whole transaction
                          className="hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};