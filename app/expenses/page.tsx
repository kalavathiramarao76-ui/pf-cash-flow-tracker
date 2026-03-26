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
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMoreExpenses, setHasMoreExpenses] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (initialLoad) {
        setInitialLoad(false);
      }
      setLoading(true);
      try {
        const expensesResponse = await getExpenses(pageNumber, itemsPerPage);
        if (pageNumber === 1) {
          setExpenses(expensesResponse.expenses);
        } else {
          setExpenses((prevExpenses) => [...prevExpenses, ...expensesResponse.expenses]);
        }
        setHasMoreExpenses(expensesResponse.hasMore);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        setLoading(false);
      }
    };
    if (initialLoad || pageNumber > 1) {
      fetchExpenses();
    }
  }, [pageNumber, itemsPerPage, initialLoad]);

  const handleAddExpense = async (expense: Expense) => {
    try {
      await addExpense(expense);
      setExpenses([...expenses, expense]);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleLoadMore = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Expenses</h1>
      {loading && pageNumber === 1 ? (
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
      {hasMoreExpenses && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleLoadMore}
          disabled={loading}
        >
          Load More
        </button>
      )}
      {loading && pageNumber > 1 && <p>Loading more expenses...</p>}
      <AddExpenseForm onAdd={handleAddExpense} />
    </div>
  );
}