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
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
        <div className="w-full md:w-1/3 xl:w-1/3 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">Financial Overview</h2>
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
        </div>
        <div className="w-full md:w-2/3 xl:w-2/3 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-2">Transaction History</h2>
          <TransactionTable transactions={transactions} />
        </div>
      </div>
      <div className="w-full p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-bold mb-2">Budgeting Chart</h2>
        <BudgetingChart income={income} expenses={expenses} budget={budget} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;