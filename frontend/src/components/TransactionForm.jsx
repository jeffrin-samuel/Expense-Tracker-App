import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Plus, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other Income'],
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Healthcare', 'Education', 'Other Expense']
};

export const TransactionForm = ({ onAddTransaction, currency }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false); // NEW: loading state

  const handleSubmit = async (e) => {  // CHANGED: now async
    e.preventDefault();

    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }
    if (!category) {
      toast.error('Please select a category');
      return;
    }

    const transaction = {
      // REMOVED: id: Date.now().toString()  — MongoDB generates _id now
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date: date.toISOString(),
      // REMOVED: createdAt — MongoDB timestamps handle this automatically
    };

    try {
      setIsSubmitting(true);
      await onAddTransaction(transaction); // CHANGED: await the API call

      // Only reset form if save was successful
      setDescription('');
      setAmount('');
      setCategory('');
      setDate(new Date());

      toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully`);
    } catch {
      // Error toast is shown in App.js, nothing extra needed here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card data-testid="transaction-form" className="border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">Type</Label>
            <Select value={type} onValueChange={(val) => { setType(val); setCategory(''); }}>
              <SelectTrigger data-testid="type-select" id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income" data-testid="type-income">Income</SelectItem>
                <SelectItem value="expense" data-testid="type-expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Input
              data-testid="description-input"
              id="description"
              type="text"
              placeholder="e.g., Groceries, Salary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">Amount ({currency})</Label>
            <Input
              data-testid="amount-input"
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border-slate-200 dark:border-slate-800 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger data-testid="category-select" id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES[type].map((cat) => (
                  <SelectItem key={cat} value={cat} data-testid={`category-${cat.toLowerCase().replace(/\s+/g, '-')}`}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  data-testid="date-picker-trigger"
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-slate-200 dark:border-slate-800"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => setDate(selectedDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* CHANGED: button shows spinner while saving */}
          <Button
            data-testid="add-transaction-button"
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};