use client;

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LocalStorage } from '../utils/localStorage';
import DashboardLayout from '../components/DashboardLayout';
import OverviewCard from '../components/OverviewCard';
import TransactionTable from '../components/TransactionTable';
import BudgetingChart from '../components/BudgetingChart';

const DashboardPage = () => {
  const pathname = usePathname();
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    const storedTransactions = LocalStorage.get('transactions');
    const storedIncome = LocalStorage.get('income');
    const storedExpenses = LocalStorage.get('expenses');
    const storedBudget = LocalStorage.get('budget');

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
    if (storedIncome) {
      setIncome(JSON.parse(storedIncome));
    }
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
    if (storedBudget) {
      setBudget(JSON.parse(storedBudget));
    }
  }, []);

  const handleAddTransaction = (transaction: any) => {
    setTransactions((prevTransactions) => [...prevTransactions, transaction]);
    LocalStorage.set('transactions', JSON.stringify([...transactions, transaction]));
  };

  const handleUpdateIncome = (newIncome: number) => {
    setIncome(newIncome);
    LocalStorage.set('income', JSON.stringify(newIncome));
  };

  const handleUpdateExpenses = (newExpenses: number) => {
    setExpenses(newExpenses);
    LocalStorage.set('expenses', JSON.stringify(newExpenses));
  };

  const handleUpdateBudget = (newBudget: number) => {
    setBudget(newBudget);
    LocalStorage.set('budget', JSON.stringify(newBudget));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <OverviewCard
          title="Income"
          amount={income}
          onAddTransaction={handleAddTransaction}
          onUpdateIncome={handleUpdateIncome}
        />
        <OverviewCard
          title="Expenses"
          amount={expenses}
          onAddTransaction={handleAddTransaction}
          onUpdateExpenses={handleUpdateExpenses}
        />
        <OverviewCard
          title="Budget"
          amount={budget}
          onAddTransaction={handleAddTransaction}
          onUpdateBudget={handleUpdateBudget}
        />
      </div>
      <div className="mt-4">
        <TransactionTable transactions={transactions} />
      </div>
      <div className="mt-4">
        <BudgetingChart income={income} expenses={expenses} budget={budget} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;