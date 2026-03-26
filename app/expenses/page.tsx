use client;

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getExpenses, addExpense, deleteExpense } from '../lib/expenses';
import { Expense } from '../types/expenses';
import ExpenseCard from '../components/ExpenseCard';
import AddExpenseForm from '../components/AddExpenseForm';

export default function ExpensesPage() {
  const pathname = usePathname();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      const expenses = await getExpenses();
      setExpenses(expenses);
      setLoading(false);
    };
    fetchExpenses();
  }, []);

  const handleAddExpense = async (expense: Expense) => {
    await addExpense(expense);
    setExpenses([...expenses, expense]);
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Expenses</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onDelete={() => handleDeleteExpense(expense.id)}
            />
          ))}
        </div>
      )}
      <AddExpenseForm onAdd={handleAddExpense} />
    </div>
  );
}