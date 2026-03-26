use client;

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { localStorage } from '../utils/localStorage';
import { SettingsLayout } from '../components/SettingsLayout';

const Page = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(localStorage.get('darkMode') || false);
  const [currency, setCurrency] = useState(localStorage.get('currency') || 'USD');
  const [language, setLanguage] = useState(localStorage.get('language') || 'en');

  const handleDarkModeChange = () => {
    setDarkMode(!darkMode);
    localStorage.set('darkMode', !darkMode);
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value);
    localStorage.set('currency', event.target.value);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
    localStorage.set('language', event.target.value);
  };

  return (
    <SettingsLayout>
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
        <h1 className="text-3xl font-bold mb-4">Settings</h1>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-medium mb-2">Dark Mode</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={handleDarkModeChange}
              className="mr-2"
            />
            <span>Enable Dark Mode</span>
          </div>
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-medium mb-2">Currency</label>
          <select
            value={currency}
            onChange={handleCurrencyChange}
            className="py-2 pl-3 pr-10 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-medium mb-2">Language</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="py-2 pl-3 pr-10 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default Page;