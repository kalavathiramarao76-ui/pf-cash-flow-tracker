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
  const [selectedDate, setSelectedDate] = useState(null);
  const [detailedTransactions, setDetailedTransactions] = useState([]);

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

  const handleDrillDown = (date: string) => {
    const filteredTransactions = transactions.filter((transaction: any) => transaction.date === date);
    setDetailedTransactions(filteredTransactions);
    setSelectedDate(date);
  };

  return (
    <DashboardLayout>
      <OverviewCard income={income} expenses={expenses} budget={budget} />
      <BudgetingChart
        chartData={chartData}
        handleDrillDown={handleDrillDown}
      />
      {selectedDate && (
        <TransactionTable
          transactions={detailedTransactions}
          title={`Transactions for ${selectedDate}`}
        />
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;