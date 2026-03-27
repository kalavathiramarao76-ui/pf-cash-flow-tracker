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
  });

  const handleChartTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setChartType(event.target.value);
  };

  useEffect(() => {
    const storedTransactions = LocalStorage.get('transactions');
    if (storedTransactions) {
      setTransactions(storedTransactions);
      const incomeAmount = storedTransactions.reduce((acc, transaction) => {
        if (transaction.type === 'income') {
          return acc + transaction.amount;
        }
        return acc;
      }, 0);
      setIncome(incomeAmount);
      const expensesAmount = storedTransactions.reduce((acc, transaction) => {
        if (transaction.type === 'expense') {
          return acc + transaction.amount;
        }
        return acc;
      }, 0);
      setExpenses(expensesAmount);
      const budgetAmount = incomeAmount - expensesAmount;
      setBudget(budgetAmount);
      const chartDataLabels = storedTransactions.map((transaction) => transaction.date);
      const chartDataIncome = storedTransactions.map((transaction) => {
        if (transaction.type === 'income') {
          return transaction.amount;
        }
        return 0;
      });
      const chartDataExpenses = storedTransactions.map((transaction) => {
        if (transaction.type === 'expense') {
          return transaction.amount;
        }
        return 0;
      });
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
      const incomeDistributionLabels = storedTransactions
        .filter((transaction) => transaction.type === 'income')
        .map((transaction) => transaction.category);
      const incomeDistributionData = storedTransactions
        .filter((transaction) => transaction.type === 'income')
        .map((transaction) => transaction.amount);
      setIncomeDistribution({
        labels: incomeDistributionLabels,
        datasets: [
          {
            label: 'Income Distribution',
            data: incomeDistributionData,
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
      const expenseDistributionLabels = storedTransactions
        .filter((transaction) => transaction.type === 'expense')
        .map((transaction) => transaction.category);
      const expenseDistributionData = storedTransactions
        .filter((transaction) => transaction.type === 'expense')
        .map((transaction) => transaction.amount);
      setExpenseDistribution({
        labels: expenseDistributionLabels,
        datasets: [
          {
            label: 'Expense Distribution',
            data: expenseDistributionData,
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
  }, []);

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
        <div className="income-distribution">
          <h2>Income Distribution</h2>
          <Pie data={incomeDistribution} />
        </div>
        <div className="expense-distribution">
          <h2>Expense Distribution</h2>
          <Pie data={expenseDistribution} />
        </div>
      </div>
      <TransactionTable transactions={transactions} />
    </DashboardLayout>
  );
};

export default DashboardPage;