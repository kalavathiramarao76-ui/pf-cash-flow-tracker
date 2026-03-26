use client;

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { localStorage } from '../utils/localStorage';

const UpgradePage = () => {
  const router = useRouter();
  const [plan, setPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const userData = localStorage.getUserData();
      if (userData) {
        const upgradedPlan = plan === 'monthly' ? 'premium-monthly' : 'premium-yearly';
        localStorage.updateUserData({ ...userData, plan: upgradedPlan });
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8 mt-10 mb-20">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Upgrade to Premium
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
        Get access to exclusive features and support our mission to help small businesses and freelancers manage their finances.
      </p>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <button
          className={`py-2 px-4 rounded-lg ${
            plan === 'monthly'
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          onClick={() => setPlan('monthly')}
        >
          Monthly
        </button>
        <button
          className={`py-2 px-4 rounded-lg ${
            plan === 'yearly'
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
          onClick={() => setPlan('yearly')}
        >
          Yearly
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
            Premium Features
          </h2>
          <ul className="list-disc list-inside text-lg text-gray-600 dark:text-gray-400">
            <li>Automated expense tracking</li>
            <li>Income forecasting</li>
            <li>Customizable financial dashboards</li>
            <li>Unusual transaction alerts</li>
            <li>Personalized budgeting recommendations</li>
            <li>Multi-account support</li>
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
            Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            {plan === 'monthly' ? '$9.99/month' : '$99.99/year'}
          </p>
        </div>
      </div>
      <button
        className="py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        onClick={handleUpgrade}
        disabled={loading}
      >
        {loading ? 'Upgrading...' : 'Upgrade Now'}
      </button>
    </div>
  );
};

export default UpgradePage;