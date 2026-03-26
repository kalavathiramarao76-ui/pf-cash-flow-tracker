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

  const handleChartTypeChange = (type: string) => {
    setChartType(type);
  };

  const handleChartOptionsChange = (options: any) => {
    setChartOptions(options);
  };

  return (
    <DashboardLayout>
      <OverviewCard
        income={income}
        expenses={expenses}
        budget={budget}
      />
      <TransactionTable transactions={transactions} />
      <div className="chart-container">
        <div className="chart-type-selector">
          <button
            className={chartType === 'line' ? 'active' : ''}
            onClick={() => handleChartTypeChange('line')}
          >
            Line
          </button>
          <button
            className={chartType === 'bar' ? 'active' : ''}
            onClick={() => handleChartTypeChange('bar')}
          >
            Bar
          </button>
          <button
            className={chartType === 'pie' ? 'active' : ''}
            onClick={() => handleChartTypeChange('pie')}
          >
            Pie
          </button>
        </div>
        {chartType === 'line' && (
          <Line
            data={chartData}
            options={chartOptions}
            className="chart"
          />
        )}
        {chartType === 'bar' && (
          <Bar
            data={chartData}
            options={chartOptions}
            className="chart"
          />
        )}
        {chartType === 'pie' && (
          <Pie
            data={chartData}
            options={chartOptions}
            className="chart"
          />
        )}
      </div>
      <div className="distribution-charts">
        <h2>Income Distribution</h2>
        <Pie
          data={incomeDistribution}
          options={chartOptions}
          className="chart"
        />
        <h2>Expense Distribution</h2>
        <Pie
          data={expenseDistribution}
          options={chartOptions}
          className="chart"
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;