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

  const handleChartTypeChange = (event: any) => {
    setChartType(event.target.value);
  };

  return (
    <DashboardLayout>
      <OverviewCard income={income} expenses={expenses} budget={budget} />
      <div className="chart-container">
        <div className="chart-type-selector">
          <label>Chart Type:</label>
          <select value={chartType} onChange={handleChartTypeChange}>
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
          </select>
        </div>
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
        <div className="income-distribution-chart">
          <Pie options={chartOptions} data={incomeDistribution} />
        </div>
        <div className="expense-distribution-chart">
          <Pie options={chartOptions} data={expenseDistribution} />
        </div>
      </div>
      <TransactionTable transactions={transactions} />
    </DashboardLayout>
  );
};

export default DashboardPage;