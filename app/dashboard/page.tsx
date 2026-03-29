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
  });

  const handleChartTypeChange = (type: string) => {
    setChartType(type);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const filteredTransactions = transactions.filter((transaction) => transaction.date === date);
    setDetailedTransactions(filteredTransactions);
  };

  useEffect(() => {
    const storedTransactions = LocalStorage.get('transactions');
    if (storedTransactions) {
      setTransactions(storedTransactions);
    }
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      const incomeData = transactions
        .filter((transaction) => transaction.type === 'income')
        .map((transaction) => transaction.amount);
      const expensesData = transactions
        .filter((transaction) => transaction.type === 'expense')
        .map((transaction) => transaction.amount);
      const labels = transactions.map((transaction) => transaction.date);

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

      const incomeDistributionData = transactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((acc, transaction) => {
          const category = transaction.category;
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += transaction.amount;
          return acc;
        }, {});

      const expenseDistributionData = transactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((acc, transaction) => {
          const category = transaction.category;
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += transaction.amount;
          return acc;
        }, {});

      setIncomeDistribution({
        labels: Object.keys(incomeDistributionData),
        datasets: [
          {
            label: 'Income Distribution',
            data: Object.values(incomeDistributionData),
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

      setExpenseDistribution({
        labels: Object.keys(expenseDistributionData),
        datasets: [
          {
            label: 'Expense Distribution',
            data: Object.values(expenseDistributionData),
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
        {chartType === 'line' ? (
          <Line options={chartOptions} data={chartData} />
        ) : chartType === 'bar' ? (
          <Bar options={chartOptions} data={chartData} />
        ) : (
          <Pie options={chartOptions} data={chartData} />
        )}
        <div className="chart-type-selector">
          <button onClick={() => handleChartTypeChange('line')}>Line</button>
          <button onClick={() => handleChartTypeChange('bar')}>Bar</button>
          <button onClick={() => handleChartTypeChange('pie')}>Pie</button>
        </div>
      </div>
      <div className="distribution-charts">
        <div className="income-distribution-chart">
          <Pie options={chartOptions} data={incomeDistribution} />
        </div>
        <div className="expense-distribution-chart">
          <Pie options={chartOptions} data={expenseDistribution} />
        </div>
      </div>
      <TransactionTable
        transactions={transactions}
        handleDateSelect={handleDateSelect}
      />
      {selectedDate && (
        <div className="detailed-transactions">
          <h2>Detailed Transactions for {selectedDate}</h2>
          <ul>
            {detailedTransactions.map((transaction) => (
              <li key={transaction.id}>
                {transaction.type} - {transaction.amount}
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;