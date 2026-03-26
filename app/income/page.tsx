use client;

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { localStorage } from '../utils/localStorage';

const IncomePage = () => {
  const pathname = usePathname();
  const [income, setIncome] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    const storedIncome = localStorage.getItem('income');
    if (storedIncome) {
      setIncome(JSON.parse(storedIncome));
      calculateTotalIncome(JSON.parse(storedIncome));
    }
  }, []);

  const calculateTotalIncome = (incomeArray) => {
    const total = incomeArray.reduce((acc, current) => acc + current.amount, 0);
    setTotalIncome(total);
  };

  const handleAddIncome = () => {
    const newIncome = {
      id: Date.now(),
      amount: 0,
      description: '',
    };
    setIncome([...income, newIncome]);
    localStorage.setItem('income', JSON.stringify([...income, newIncome]));
  };

  const handleUpdateIncome = (id, amount, description) => {
    const updatedIncome = income.map((item) => {
      if (item.id === id) {
        return { ...item, amount, description };
      }
      return item;
    });
    setIncome(updatedIncome);
    localStorage.setItem('income', JSON.stringify(updatedIncome));
    calculateTotalIncome(updatedIncome);
  };

  const handleDeleteIncome = (id) => {
    const filteredIncome = income.filter((item) => item.id !== id);
    setIncome(filteredIncome);
    localStorage.setItem('income', JSON.stringify(filteredIncome));
    calculateTotalIncome(filteredIncome);
  };

  return (
    <div className="flex flex-col h-screen p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">Income</h1>
      <div className="flex flex-col mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleAddIncome}
        >
          Add Income
        </button>
      </div>
      <div className="flex flex-col">
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {income.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2">{item.description}</td>
                <td className="px-4 py-2">${item.amount}</td>
                <td className="px-4 py-2 flex justify-end">
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleUpdateIncome(item.id, item.amount, item.description)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDeleteIncome(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col mt-4">
        <h2 className="text-xl font-bold mb-2">Total Income</h2>
        <p className="text-3xl font-bold">${totalIncome}</p>
        {totalIncome > 0 ? (
          <ArrowUpIcon className="text-green-500 w-6 h-6" />
        ) : (
          <ArrowDownIcon className="text-red-500 w-6 h-6" />
        )}
      </div>
    </div>
  );
};

export default IncomePage;