import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LocalStorage } from '../utils/localStorage';
import DashboardLayout from '../components/DashboardLayout';
import OverviewCard from '../components/OverviewCard';
import TransactionTable from '../components/TransactionTable';
import BudgetingChart from '../components/BudgetingChart';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const pathname = usePathname();
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [budget, setBudget] = useState(0);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Income',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Expenses',
        data: [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  });

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

  useEffect(() => {
    const labels = transactions.map((transaction: any) => transaction.date);
    const incomeData = transactions.map((transaction: any) => transaction.income);
    const expensesData = transactions.map((transaction: any) => transaction.expenses);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        },
        {
          label: 'Expenses',
          data: expensesData,
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
        },
      ],
    });
  }, [transactions]);

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
          <h2 className="text-lg font-bold mb-2">Financial Trends</h2>
          <Line options={{ responsive: true }} data={chartData} />
          <BudgetingChart />
          <TransactionTable transactions={transactions} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;