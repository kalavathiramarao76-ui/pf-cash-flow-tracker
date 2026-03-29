import { useState, useEffect, useRef, useCallback } from 'react';
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
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchExpenses = useCallback(async () => {
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
  }, [pageNumber, itemsPerPage, initialLoad]);

  useEffect(() => {
    if (initialLoad) {
      fetchExpenses();
    }
  }, [initialLoad, fetchExpenses]);

  useEffect(() => {
    if (pageNumber > 1) {
      fetchExpenses();
    }
  }, [pageNumber, fetchExpenses]);

  const handleScroll = useCallback(async () => {
    if (loadMoreRef.current && loadMoreRef.current.getBoundingClientRect().top < window.innerHeight) {
      if (hasMoreExpenses && !loading) {
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
      }
    }
  }, [hasMoreExpenses, loading]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      window.addEventListener('scroll', handleScroll);
    }, 1000);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

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

  const handleIntersection = useCallback(async (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting && hasMoreExpenses && !loading) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  }, [hasMoreExpenses, loading]);

  useEffect(() => {
    if (loadMoreRef.current) {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      };
      observer.current = new IntersectionObserver(handleIntersection, options);
      observer.current.observe(loadMoreRef.current);
    }
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [handleIntersection]);

  return (
    <div>
      <h1>Expenses</h1>
      <AddExpenseForm onAddExpense={handleAddExpense} />
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} onDelete={handleDeleteExpense} />
      ))}
      {hasMoreExpenses && (
        <div ref={loadMoreRef}>
          {loading ? <p>Loading...</p> : <p>Load more</p>}
        </div>
      )}
    </div>
  );
}