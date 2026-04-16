import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
];

export const Header = ({ currency, onCurrencyChange, darkMode, onToggleDarkMode }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-3">
         <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-50">
            {CURRENCIES.find(c => c.code === currency)?.symbol}
         </span>
          Expense Tracker
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2">
          Track your income and expenses with ease
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Currency:
          </label>
          <Select value={currency} onValueChange={onCurrencyChange}>
            <SelectTrigger 
              data-testid="currency-select"
              className="w-[180px] border-slate-200 dark:border-slate-800"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((curr) => (
                <SelectItem 
                  key={curr.code} 
                  value={curr.code}
                  data-testid={`currency-${curr.code}`}
                >
                  {curr.symbol} {curr.name} ({curr.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          data-testid="theme-toggle-button"
          variant="outline"
          size="icon"
          onClick={onToggleDarkMode}
          className="border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-slate-900 dark:text-slate-50" />
          ) : (
            <Moon className="h-5 w-5 text-slate-900" />
          )}
        </Button>
      </div>
    </header>
  );
};