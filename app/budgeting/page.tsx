use client;

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { BudgetCategory, Transaction } from '../types';
import BudgetForm from './budget-form';
import BudgetTable from './budget-table';
import { getBudgetCategories, getTransactions, saveTransactions } from '../utils/local-storage';

export default function BudgetingPage() {
  const pathname = usePathname();
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [suggestedCategories, setSuggestedCategories] = useState<BudgetCategory[]>([]);

  useEffect(() => {
    const storedBudgetCategories = getBudgetCategories();
    const storedTransactions = getTransactions();
    setBudgetCategories(storedBudgetCategories);
    setTransactions(storedTransactions);
  }, []);

  useEffect(() => {
    const suggestedCategories = suggestBudgetCategories(transactions);
    setSuggestedCategories(suggestedCategories);
  }, [transactions]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleBudgetSubmit = (newBudget: BudgetCategory) => {
    const updatedBudgetCategories = [...budgetCategories, newBudget];
    setBudgetCategories(updatedBudgetCategories);
    localStorage.setItem('budgetCategories', JSON.stringify(updatedBudgetCategories));
  };

  const categorizeTransaction = (transaction: Transaction): Transaction => {
    const category = budgetCategories.find(category => {
      const keywords = category.keywords || [];
      const description = transaction.description.toLowerCase();
      return keywords.some(keyword => description.includes(keyword.toLowerCase()));
    });
    return { ...transaction, category: category?.name || 'Uncategorized' };
  };

  const handleTransactionCategorization = () => {
    const categorizedTransactions = transactions.map(categorizeTransaction);
    setTransactions(categorizedTransactions);
    saveTransactions(categorizedTransactions);
  };

  useEffect(() => {
    handleTransactionCategorization();
  }, [budgetCategories, transactions]);

  const suggestBudgetCategories = (transactions: Transaction[]): BudgetCategory[] => {
    const categorySuggestions: { [key: string]: BudgetCategory } = {};
    transactions.forEach(transaction => {
      const description = transaction.description.toLowerCase();
      const words = description.split(' ');
      words.forEach(word => {
        if (word.length > 3 && !categorySuggestions[word]) {
          categorySuggestions[word] = { name: word, keywords: [word] };
        }
      });
    });
    return Object.values(categorySuggestions);
  };

  return (
    <div className="flex flex-col h-screen p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">Budgeting</h1>
      <BudgetForm
        budgetCategories={budgetCategories}
        suggestedCategories={suggestedCategories}
        onBudgetSubmit={handleBudgetSubmit}
      />
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Budget Categories</h2>
        <BudgetTable
          budgetCategories={budgetCategories}
          transactions={transactions}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>
    </div>
  );
}