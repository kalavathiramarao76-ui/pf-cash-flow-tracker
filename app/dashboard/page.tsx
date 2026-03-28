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

  const handleChartTypeChange = (event: any) => {
    setChartType(event.target.value);
  };

  const handleDrillDown = (event: any, elements: any) => {
    if (elements.length > 0) {
      const datasetIndex = elements[0].datasetIndex;
      const index = elements[0].index;
      const label = chartData.labels[index];
      const value = chartData.datasets[datasetIndex].data[index];
      if (datasetIndex === 0) {
        // Income
        setDetailedTransactions(
          transactions.filter((transaction) => transaction.date === label)
        );
      } else {
        // Expenses
        setDetailedTransactions(
          transactions.filter((transaction) => transaction.date === label)
        );
      }
    }
  };

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
          <Line
            options={chartOptions}
            data={chartData}
            onClick={handleDrillDown}
          />
        )}
        {chartType === 'bar' && (
          <Bar
            options={chartOptions}
            data={chartData}
            onClick={handleDrillDown}
          />
        )}
        {chartType === 'pie' && (
          <Pie
            options={chartOptions}
            data={chartData}
            onClick={handleDrillDown}
          />
        )}
      </div>
      <TransactionTable transactions={detailedTransactions} />
      <div className="distribution-charts">
        <h2>Income Distribution</h2>
        <Pie
          options={chartOptions}
          data={incomeDistribution}
          onClick={handleDrillDown}
        />
        <h2>Expense Distribution</h2>
        <Pie
          options={chartOptions}
          data={expenseDistribution}
          onClick={handleDrillDown}
        />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;