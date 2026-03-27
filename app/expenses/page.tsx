import { useState, useEffect, useRef } from 'react';
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
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const handleScroll = async () => {
      if (loadMoreRef.current && loadMoreRef.current.getBoundingClientRect().top < window.innerHeight) {
        if (hasMoreExpenses && !loading) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMoreExpenses, loading]);

  const handleAddExpense = async (expense: Expense) => {
    try {
      await addExpense(expense);
      setExpenses((prevExpenses) => {
        const newExpenses = [...prevExpenses, expense];
        return newExpenses.slice(0, itemsPerPage * pageNumber);
      });
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-4">Expenses</h1>
      {loading && pageNumber === 1 ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expenses.map((expense, index) => (
            <ExpenseCard key={expense.id} expense={expense} onDelete={handleDeleteExpense} />
          ))}
          {hasMoreExpenses && !loading && (
            <div ref={loadMoreRef} className="w-full h-10" />
          )}
          {loading && pageNumber > 1 && (
            <p>Loading more expenses...</p>
          )}
        </div>
      )}
      <AddExpenseForm onAdd={handleAddExpense} />
    </div>
  );
}