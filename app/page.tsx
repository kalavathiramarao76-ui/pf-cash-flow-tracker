'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { FaCheckCircle } from 'react-icons/fa';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';

export default function Page() {
  const [darkMode, setDarkMode] = useState(false);

  const handleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="bg-gradient-to-r from-blue-500 to-purple-500 py-4 text-white">
        <nav className="container mx-auto flex justify-between px-4">
          <Link href="/" className="text-lg font-bold">
            Cash Flow Tracker
          </Link>
          <button
            className="rounded-full bg-gray-200 py-2 px-4 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            onClick={handleDarkMode}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </nav>
      </header>
      <main className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Automated Cash Flow Management
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-200">
            Take control of your finances with our intuitive cash flow management tool.
          </p>
          <Link
            href="/dashboard"
            className="rounded-full bg-blue-500 py-2 px-4 text-white hover:bg-blue-600"
          >
            Get Started <AiOutlineArrowRight className="inline-block" />
          </Link>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Features
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded bg-white p-4 shadow dark:bg-gray-800">
              <FaCheckCircle className="text-blue-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Automated Expense Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Easily track your expenses and stay on top of your finances.
              </p>
            </div>
            <div className="rounded bg-white p-4 shadow dark:bg-gray-800">
              <FaCheckCircle className="text-blue-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Income Forecasting
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Get accurate predictions of your future income and plan accordingly.
              </p>
            </div>
            <div className="rounded bg-white p-4 shadow dark:bg-gray-800">
              <FaCheckCircle className="text-blue-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Customizable Financial Dashboards
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Create personalized dashboards to suit your financial needs.
              </p>
            </div>
            <div className="rounded bg-white p-4 shadow dark:bg-gray-800">
              <FaCheckCircle className="text-blue-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Unusual Transaction Alerts
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Stay informed about any suspicious transactions and take action.
              </p>
            </div>
            <div className="rounded bg-white p-4 shadow dark:bg-gray-800">
              <FaCheckCircle className="text-blue-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Personalized Budgeting Recommendations
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Get tailored budgeting advice to help you achieve your financial goals.
              </p>
            </div>
            <div className="rounded bg-white p-4 shadow dark:bg-gray-800">
              <FaCheckCircle className="text-blue-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Multi-Account Support
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Manage multiple accounts and stay organized.
              </p>
            </div>
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pricing
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded bg-white p-4 shadow dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Basic
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                $9.99/month
              </p>
              <ul>
                <li>Automated expense tracking</li>
                <li>Income forecasting</li>
                <li>Customizable financial dashboards</li>
              </ul>
              <Link
                href="/upgrade"
                className="rounded-full bg-blue-500 py-2 px-4 text-white hover:bg-blue-600"
              >
                Upgrade <AiOutlineArrowRight className="inline-block" />
              </Link>
            </div>
            <div className="rounded bg-white p-4 shadow dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Premium
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                $19.99/month
              </p>
              <ul>
                <li>Automated expense tracking</li>
                <li>Income forecasting</li>
                <li>Customizable financial dashboards</li>
                <li>Unusual transaction alerts</li>
                <li>Personalized budgeting recommendations</li>
              </ul>
              <Link
                href="/upgrade"
                className="rounded-full bg-blue-500 py-2 px-4 text-white hover:bg-blue-600"
              >
                Upgrade <AiOutlineArrowRight className="inline-block" />
              </Link>
            </div>
            <div className="rounded bg-white p-4 shadow dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Enterprise
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                Custom pricing
              </p>
              <ul>
                <li>Automated expense tracking</li>
                <li>Income forecasting</li>
                <li>Customizable financial dashboards</li>
                <li>Unusual transaction alerts</li>
                <li>Personalized budgeting recommendations</li>
                <li>Multi-account support</li>
              </ul>
              <Link
                href="/contact"
                className="rounded-full bg-blue-500 py-2 px-4 text-white hover:bg-blue-600"
              >
                Contact Us <AiOutlineArrowRight className="inline-block" />
              </Link>
            </div>
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded bg-white p-4 shadow dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                What is Cash Flow Tracker?
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Cash Flow Tracker is a financial management tool that helps small
                business owners and freelancers track their expenses, forecast
                their income, and create personalized budgeting plans.
              </p>
            </div>
            <div className="rounded bg-white p-4 shadow dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                How does Cash Flow Tracker work?
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Cash Flow Tracker uses advanced algorithms to track your expenses
                and forecast your income. It also provides personalized
                budgeting recommendations based on your financial data.
              </p>
            </div>
            <div className="rounded bg-white p-4 shadow dark:bg-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Is Cash Flow Tracker secure?
              </h3>
              <p className="text-gray-600 dark:text-gray-200">
                Yes, Cash Flow Tracker is completely secure. We use industry-standard
                encryption to protect your financial data and ensure that it is
                only accessible to you.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-200 p-4 text-gray-600 dark:bg-gray-800 dark:text-gray-200">
        <div className="container mx-auto flex justify-between">
          <p>&copy; 2024 Cash Flow Tracker</p>
          <ul>
            <li>
              <Link href="/terms" className="text-gray-600 dark:text-gray-200">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-gray-600 dark:text-gray-200">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
}