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
import { Line, Bar, Pie } from 'react-chartjs-2';

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
  const [incomeDistribution, setIncomeDistribution] = useState({
    labels: [],
    datasets: [
      {
        label: 'Income Distribution',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });
  const [expenseDistribution, setExpenseDistribution] = useState({
    labels: [],
    datasets: [
      {
        label: 'Expense Distribution',
        data: [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const storedTransactions = LocalStorage.get('transactions');
    const storedIncome = LocalStorage.get('income');
    const storedExpenses = LocalStorage.get('expenses');
    const storedBudget = LocalStorage.get('budget');

    if (storedTransactions) {
      setTransactions(storedTransactions);
    }
    if (storedIncome) {
      setIncome(storedIncome);
    }
    if (storedExpenses) {
      setExpenses(storedExpenses);
    }
    if (storedBudget) {
      setBudget(storedBudget);
    }
  }, []);

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    const filteredTransactions = transactions.filter((transaction: any) => {
      return transaction.date === date;
    });
    setDetailedTransactions(filteredTransactions);
  };

  const handleChartClick = (event: any, elements: any) => {
    if (elements.length > 0) {
      const chartData = elements[0].dataset.data;
      const chartLabel = elements[0].dataset.label;
      if (chartLabel === 'Income') {
        const incomeData = chartData[elements[0].index];
        const incomeTransactions = transactions.filter((transaction: any) => {
          return transaction.type === 'income' && transaction.date === selectedDate;
        });
        setDetailedTransactions(incomeTransactions);
      } else if (chartLabel === 'Expenses') {
        const expenseData = chartData[elements[0].index];
        const expenseTransactions = transactions.filter((transaction: any) => {
          return transaction.type === 'expense' && transaction.date === selectedDate;
        });
        setDetailedTransactions(expenseTransactions);
      }
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Cash Flow Chart',
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
      axis: 'xy',
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <DashboardLayout>
      <OverviewCard income={income} expenses={expenses} budget={budget} />
      <div className="chart-container">
        <Line
          data={chartData}
          options={options}
          onClick={(event, elements) => handleChartClick(event, elements)}
        />
      </div>
      <div className="chart-container">
        <Pie
          data={incomeDistribution}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: 'Income Distribution',
              },
            },
          }}
        />
      </div>
      <div className="chart-container">
        <Pie
          data={expenseDistribution}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              title: {
                display: true,
                text: 'Expense Distribution',
              },
            },
          }}
        />
      </div>
      <TransactionTable transactions={detailedTransactions} />
    </DashboardLayout>
  );
};

export default DashboardPage;