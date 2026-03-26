import * as tf from '@tensorflow/tfjs';
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
  const [mlModel, setMlModel] = useState<tf.Sequential | null>(null);

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

  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await tf.loadLayersModel('https://example.com/model.json');
        setMlModel(model);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };
    loadModel();
  }, []);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleBudgetSubmit = (newBudget: BudgetCategory) => {
    const updatedBudgetCategories = [...budgetCategories, newBudget];
    setBudgetCategories(updatedBudgetCategories);
    localStorage.setItem('budgetCategories', JSON.stringify(updatedBudgetCategories));
  };

  const categorizeTransaction = (transaction: Transaction): Transaction => {
    if (mlModel) {
      const input = tf.tensor2d([[
        transaction.amount,
        ...transaction.description.toLowerCase().split(' ').map(word => word.length),
        ...transaction.description.toLowerCase().split(' ').map(word => word.charCodeAt(0)),
      ]]);
      const output = mlModel.predict(input);
      const categoryIndex = tf.argMax(output, 1).dataSync()[0];
      const category = budgetCategories[categoryIndex];
      return { ...transaction, category: category?.name || 'Uncategorized' };
    } else {
      const category = budgetCategories.find(category => {
        const keywords = category.keywords || [];
        const description = transaction.description.toLowerCase();
        return keywords.some(keyword => description.includes(keyword.toLowerCase()));
      });
      return { ...transaction, category: category?.name || 'Uncategorized' };
    }
  };

  const handleTransactionCategorization = () => {
    const categorizedTransactions = transactions.map(categorizeTransaction);
    setTransactions(categorizedTransactions);
    saveTransactions(categorizedTransactions);
  };

  return (
    <div>
      <BudgetForm
        budgetCategories={budgetCategories}
        onBudgetSubmit={handleBudgetSubmit}
      />
      <BudgetTable
        transactions={transactions}
        budgetCategories={budgetCategories}
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
        suggestedCategories={suggestedCategories}
        onTransactionCategorization={handleTransactionCategorization}
      />
    </div>
  );
}

function suggestBudgetCategories(transactions: Transaction[]): BudgetCategory[] {
  // implement logic to suggest budget categories based on transactions
  return [];
}