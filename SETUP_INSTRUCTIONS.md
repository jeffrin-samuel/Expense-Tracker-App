# Expense Tracker - Setup Instructions

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)

## Installation Steps

### 1. Navigate to the frontend folder

```bash

cd frontend

```

### 2. Fix dependency conflicts & Install

```bash

npm install ajv@^8 --legacy-peer-deps
npm install --legacy-peer-deps

```

### 3. Start the Development Server

```bash

npm start

```

The application will open automatically in your browser at:

```
http://localhost:3000

```

---

## Usage Guide

### Adding Transactions

1. **Select Type** - Choose between Income or Expense
2. **Enter Description** - Add a description (e.g., "Salary", "Groceries")
3. **Enter Amount** - Type the amount (positive numbers only)
4. **Select Category** - Choose from predefined categories
5. **Pick Date** - Select the transaction date
6. **Click "Add Transaction"** - Your transaction will be added

### Currency Selection

- Click the **Currency dropdown** in the header
- Select your preferred currency (INR, USD, EUR, GBP, JPY, AUD, CAD)
- Selection persists across sessions

### Dark/Light Mode

- Click the **Sun/Moon icon** in the header to toggle themes
- Theme preference is saved automatically

### Search & Filter

- **Search** - Type in the search box to find transactions by description
- **Filter by Type** - Select All Types, Income, or Expense
- **Filter by Category** - Select specific categories to narrow down results

### Deleting Transactions

- Click the **trash icon** next to any transaction to delete it

---

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ui/                 # Shadcn UI components
│   │   ├── Header.jsx          # Currency selector & theme toggle
│   │   ├── SummaryCards.jsx    # Balance, Income, Expense cards
│   │   ├── TransactionForm.jsx # Add transaction form
│   │   └── TransactionList.jsx # List of all transactions
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── lib/
│   │   └── utils.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── tailwind.config.js
```

---

## Customization

### Adding New Categories

Edit `/src/components/TransactionForm.jsx`:
```javascript
const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Your Category'],
  expense: ['Food', 'Transport', 'Your Category']
};
```

### Adding New Currencies

Edit `/src/components/Header.jsx`:
```javascript
const CURRENCIES = [
  { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs' },
  // Add more...
];
```

---


## Troubleshooting

### Port 3000 Already in Use

```bash

$env:PORT=3001; npm start

```

Add it to **SETUP INSTRUCTIONS** under a **Troubleshooting section** — because it's something you encounter while running the app, not a feature!

Here's the section to add:

---


**🔁 ResizeObserver Loop Error**

You may see this error in the browser when clicking dropdowns quickly:

```
ERROR: ResizeObserver loop completed with undelivered notifications

```

**🧠 Why This Happens**

When you click a dropdown:

1. Dropdown opens 📂
2. Component size changes 📐
3. ResizeObserver detects the size change 👀
4. That change triggers ANOTHER resize
5. Browser gets into a tiny loop 🔄
6. Browser complains about it

Usually caused by Dropdown libraries, Radix UI, Tailwind dynamic layouts — all of which your app uses!

**✅ Is it a problem?**

Ask yourself:

- Dropdown opens fine? ✅
- No crash? ✅
- No blank screen? ✅

If all YES → **It's just a harmless dev warning, ignore it!**

**🔎 Why only when clicking fast?**

Rapid clicking = rapid layout recalculations = browser complains. Totally normal in development mode and won't appear in a production build!

---




### Installation Fails

```powershell

Remove-Item -Recurse -Force node_modules
npm install ajv@^8 --legacy-peer-deps
npm install --legacy-peer-deps

```

---

## Data Storage

All data is stored in your browser's localStorage:
- **Transactions** - `expense-tracker-transactions`
- **Currency** - `expense-tracker-currency`
- **Theme** - `expense-tracker-dark-mode`

> **Note:** Clearing browser data will delete all transactions.