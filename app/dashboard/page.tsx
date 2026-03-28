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

  const handleChartClick = (event: any, elements: any) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const label = chartData.labels[index];
      const data = chartData.datasets[0].data[index];
      setSelectedDate(label);
      setDetailedTransactions(
        transactions.filter((transaction) => transaction.date === label)
      );
    }
  };

  const handleChartTypeChange = (event: any) => {
    setChartType(event.target.value);
  };

  useEffect(() => {
    const storedTransactions = LocalStorage.get('transactions');
    if (storedTransactions) {
      setTransactions(storedTransactions);
      const income = storedTransactions.reduce((acc, transaction) => {
        if (transaction.type === 'income') {
          return acc + transaction.amount;
        }
        return acc;
      }, 0);
      const expenses = storedTransactions.reduce((acc, transaction) => {
        if (transaction.type === 'expense') {
          return acc + transaction.amount;
        }
        return acc;
      }, 0);
      setIncome(income);
      setExpenses(expenses);
      setBudget(income - expenses);
      const chartData = {
        labels: storedTransactions.map((transaction) => transaction.date),
        datasets: [
          {
            label: 'Income',
            data: storedTransactions.map((transaction) => {
              if (transaction.type === 'income') {
                return transaction.amount;
              }
              return 0;
            }),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          },
          {
            label: 'Expenses',
            data: storedTransactions.map((transaction) => {
              if (transaction.type === 'expense') {
                return transaction.amount;
              }
              return 0;
            }),
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
          },
        ],
      };
      setChartData(chartData);
      const incomeDistribution = {
        labels: storedTransactions
          .filter((transaction) => transaction.type === 'income')
          .map((transaction) => transaction.category),
        datasets: [
          {
            label: 'Income Distribution',
            data: storedTransactions
              .filter((transaction) => transaction.type === 'income')
              .map((transaction) => transaction.amount),
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
      };
      setIncomeDistribution(incomeDistribution);
      const expenseDistribution = {
        labels: storedTransactions
          .filter((transaction) => transaction.type === 'expense')
          .map((transaction) => transaction.category),
        datasets: [
          {
            label: 'Expense Distribution',
            data: storedTransactions
              .filter((transaction) => transaction.type === 'expense')
              .map((transaction) => transaction.amount),
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
      };
      setExpenseDistribution(expenseDistribution);
    }
  }, []);

  return (
    <DashboardLayout>
      <OverviewCard income={income} expenses={expenses} budget={budget} />
      <div className="chart-container">
        {chartType === 'line' ? (
          <Line
            data={chartData}
            options={chartOptions}
            onClick={handleChartClick}
          />
        ) : chartType === 'bar' ? (
          <Bar
            data={chartData}
            options={chartOptions}
            onClick={handleChartClick}
          />
        ) : (
          <Pie
            data={chartData}
            options={chartOptions}
            onClick={handleChartClick}
          />
        )}
        <select value={chartType} onChange={handleChartTypeChange}>
          <option value="line">Line</option>
          <option value="bar">Bar</option>
          <option value="pie">Pie</option>
        </select>
      </div>
      <div className="distribution-charts">
        <h2>Income Distribution</h2>
        <Pie data={incomeDistribution} options={chartOptions} />
        <h2>Expense Distribution</h2>
        <Pie data={expenseDistribution} options={chartOptions} />
      </div>
      {selectedDate && (
        <div className="detailed-transactions">
          <h2>Detailed Transactions for {selectedDate}</h2>
          <TransactionTable transactions={detailedTransactions} />
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;