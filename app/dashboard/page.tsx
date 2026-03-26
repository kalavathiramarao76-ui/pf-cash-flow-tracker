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
        text: 'Cash Flow Chart',
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Amount',
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const datasetIndex = elements[0].datasetIndex;
        const index = elements[0].index;
        const label = chartData.labels[index];
        const data = chartData.datasets[datasetIndex].data[index];
        if (datasetIndex === 0) {
          // Income
          const incomeTransactions = transactions.filter((transaction) => transaction.type === 'income' && transaction.date === label);
          setDetailedTransactions(incomeTransactions);
        } else {
          // Expenses
          const expenseTransactions = transactions.filter((transaction) => transaction.type === 'expense' && transaction.date === label);
          setDetailedTransactions(expenseTransactions);
        }
      }
    },
  });

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  useEffect(() => {
    const storedTransactions = LocalStorage.get('transactions');
    if (storedTransactions) {
      setTransactions(storedTransactions);
      const incomeTransactions = storedTransactions.filter((transaction) => transaction.type === 'income');
      const expenseTransactions = storedTransactions.filter((transaction) => transaction.type === 'expense');
      setIncome(incomeTransactions.reduce((acc, transaction) => acc + transaction.amount, 0));
      setExpenses(expenseTransactions.reduce((acc, transaction) => acc + transaction.amount, 0));
      setBudget(income - expenses);
      const chartLabels = storedTransactions.map((transaction) => transaction.date);
      const chartIncomeData = incomeTransactions.map((transaction) => transaction.amount);
      const chartExpenseData = expenseTransactions.map((transaction) => transaction.amount);
      setChartData({
        labels: chartLabels,
        datasets: [
          {
            label: 'Income',
            data: chartIncomeData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          },
          {
            label: 'Expenses',
            data: chartExpenseData,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
          },
        ],
      });
    }
  }, []);

  return (
    <DashboardLayout>
      <OverviewCard income={income} expenses={expenses} budget={budget} />
      <div className="chart-container">
        {chartType === 'line' ? (
          <Line options={chartOptions} data={chartData} />
        ) : chartType === 'bar' ? (
          <Bar options={chartOptions} data={chartData} />
        ) : (
          <Pie options={chartOptions} data={chartData} />
        )}
        <select value={chartType} onChange={handleChartTypeChange}>
          <option value="line">Line</option>
          <option value="bar">Bar</option>
          <option value="pie">Pie</option>
        </select>
      </div>
      <TransactionTable transactions={detailedTransactions} />
      <BudgetingChart incomeDistribution={incomeDistribution} expenseDistribution={expenseDistribution} />
    </DashboardLayout>
  );
};

export default DashboardPage;