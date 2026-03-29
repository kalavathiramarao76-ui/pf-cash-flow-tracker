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
  const [chartType, setChartType] = useState('line');
  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Financial Data',
      },
    },
  });

  const handleChartTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setChartType(event.target.value);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const storedTransactions = LocalStorage.getTransactions();
    if (storedTransactions) {
      setTransactions(storedTransactions);
    }
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      const incomeData = transactions.filter((transaction) => transaction.type === 'income');
      const expensesData = transactions.filter((transaction) => transaction.type === 'expense');
      const incomeTotal = incomeData.reduce((acc, current) => acc + current.amount, 0);
      const expensesTotal = expensesData.reduce((acc, current) => acc + current.amount, 0);
      setIncome(incomeTotal);
      setExpenses(expensesTotal);
      setBudget(incomeTotal - expensesTotal);

      const chartDataLabels = transactions.map((transaction) => transaction.date);
      const chartDataIncome = incomeData.map((transaction) => transaction.amount);
      const chartDataExpenses = expensesData.map((transaction) => transaction.amount);
      setChartData({
        labels: chartDataLabels,
        datasets: [
          {
            label: 'Income',
            data: chartDataIncome,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          },
          {
            label: 'Expenses',
            data: chartDataExpenses,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
          },
        ],
      });
    }
  }, [transactions]);

  useEffect(() => {
    if (selectedDate) {
      const filteredTransactions = transactions.filter((transaction) => transaction.date === selectedDate);
      setDetailedTransactions(filteredTransactions);
    }
  }, [selectedDate, transactions]);

  useEffect(() => {
    if (transactions.length > 0) {
      const incomeDistributionData = transactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((acc, current) => {
          if (!acc[current.category]) {
            acc[current.category] = 0;
          }
          acc[current.category] += current.amount;
          return acc;
        }, {});

      const expenseDistributionData = transactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((acc, current) => {
          if (!acc[current.category]) {
            acc[current.category] = 0;
          }
          acc[current.category] += current.amount;
          return acc;
        }, {});

      const incomeDistributionLabels = Object.keys(incomeDistributionData);
      const incomeDistributionValues = Object.values(incomeDistributionData);
      setIncomeDistribution({
        labels: incomeDistributionLabels,
        datasets: [
          {
            label: 'Income Distribution',
            data: incomeDistributionValues,
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

      const expenseDistributionLabels = Object.keys(expenseDistributionData);
      const expenseDistributionValues = Object.values(expenseDistributionData);
      setExpenseDistribution({
        labels: expenseDistributionLabels,
        datasets: [
          {
            label: 'Expense Distribution',
            data: expenseDistributionValues,
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
    }
  }, [transactions]);

  return (
    <DashboardLayout>
      <OverviewCard income={income} expenses={expenses} budget={budget} />
      <div className="chart-container">
        <select value={chartType} onChange={handleChartTypeChange}>
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
        {chartType === 'line' && (
          <Line options={chartOptions} data={chartData} />
        )}
        {chartType === 'bar' && (
          <Bar options={chartOptions} data={chartData} />
        )}
        {chartType === 'pie' && (
          <Pie options={chartOptions} data={chartData} />
        )}
      </div>
      <div className="distribution-charts">
        <h2>Income Distribution</h2>
        <Pie options={chartOptions} data={incomeDistribution} />
        <h2>Expense Distribution</h2>
        <Pie options={chartOptions} data={expenseDistribution} />
      </div>
      <TransactionTable transactions={detailedTransactions} />
    </DashboardLayout>
  );
};

export default DashboardPage;