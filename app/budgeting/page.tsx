import * as tf from '@tensorflow/tfjs';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { BudgetCategory, Transaction } from '../types';
import BudgetForm from './budget-form';
import BudgetTable from './budget-table';
import { getBudgetCategories, getTransactions, saveTransactions } from '../utils/local-storage';

export default function BudgetingPage() {
  const pathname = usePathname();
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [suggestedCategories, setSuggestedCategories] = useState<BudgetCategory[]>([]);
  const [mlModel, setMlModel] = useState<tf.Sequential | null>(null);
  const [trainingData, setTrainingData] = useState<Transaction[]>([]);
  const [validationData, setValidationData] = useState<Transaction[]>([]);
  const [modelAccuracy, setModelAccuracy] = useState<number | null>(null);

  useEffect(() => {
    const storedBudgetCategories = getBudgetCategories();
    const storedTransactions = getTransactions();
    setBudgetCategories(storedBudgetCategories);
    setTransactions(storedTransactions);
  }, []);

  useEffect(() => {
    const suggestedCategories = suggestBudgetCategories(transactions);
    setSuggestedCategories(suggestedCategories);
  }, [transactions]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await tf.loadLayersModel('https://example.com/advanced-model.json');
        setMlModel(model);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };
    loadModel();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      const splitIndex = Math.floor(transactions.length * 0.8);
      const trainingData = transactions.slice(0, splitIndex);
      const validationData = transactions.slice(splitIndex);
      setTrainingData(trainingData);
      setValidationData(validationData);
    }
  }, [transactions]);

  useEffect(() => {
    if (trainingData.length > 0 && budgetCategories.length > 0) {
      trainModel();
    }
  }, [trainingData, budgetCategories]);

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleBudgetSubmit = (newBudget: BudgetCategory) => {
    const updatedBudgetCategories = [...budgetCategories, newBudget];
    setBudgetCategories(updatedBudgetCategories);
    localStorage.setItem('budgetCategories', JSON.stringify(updatedBudgetCategories));
  };

  const categorizeTransaction = (transaction: Transaction): Transaction => {
    if (mlModel) {
      const embeddingLayer = tf.layers.embedding({
        inputDim: 10000,
        outputDim: 128,
        inputLength: transaction.description.split(' ').length,
      });
      const sequenceLayer = tf.layers.flatten();
      const denseLayer = tf.layers.dense({
        units: budgetCategories.length,
        activation: 'softmax',
      });
      const output = denseLayer.apply(sequenceLayer.apply(embeddingLayer.apply(tf.tensor2d([transaction.description.split(' ')]))));
      const prediction = tf.argMax(output, 1);
      const predictedCategory = budgetCategories[prediction.dataSync()[0]];
      return { ...transaction, category: predictedCategory.name };
    }
    return transaction;
  };

  const suggestBudgetCategories = (transactions: Transaction[]): BudgetCategory[] => {
    const categories: BudgetCategory[] = [];
    const categoryCounts: { [key: string]: number } = {};
    transactions.forEach((transaction) => {
      const category = categorizeTransaction(transaction).category;
      if (categoryCounts[category]) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }
    });
    Object.keys(categoryCounts).forEach((category) => {
      const count = categoryCounts[category];
      const percentage = (count / transactions.length) * 100;
      categories.push({ name: category, percentage });
    });
    return categories;
  };

  const trainModel = async () => {
    if (mlModel) {
      const trainingInputs = trainingData.map((transaction) => transaction.description.split(' '));
      const trainingOutputs = trainingData.map((transaction) => budgetCategories.findIndex((category) => category.name === transaction.category));
      const validationInputs = validationData.map((transaction) => transaction.description.split(' '));
      const validationOutputs = validationData.map((transaction) => budgetCategories.findIndex((category) => category.name === transaction.category));
      const trainingTensor = tf.tensor2d(trainingInputs, [trainingInputs.length, trainingInputs[0].length], 'string');
      const trainingOutputTensor = tf.tensor1d(trainingOutputs, 'int32');
      const validationTensor = tf.tensor2d(validationInputs, [validationInputs.length, validationInputs[0].length], 'string');
      const validationOutputTensor = tf.tensor1d(validationOutputs, 'int32');
      await mlModel.fit(trainingTensor, trainingOutputTensor, {
        epochs: 100,
        validationData: [validationTensor, validationOutputTensor],
      });
      const accuracy = mlModel.evaluate(validationTensor, validationOutputTensor);
      setModelAccuracy(accuracy);
    }
  };

  return (
    <div>
      <BudgetForm
        budgetCategories={budgetCategories}
        handleBudgetSubmit={handleBudgetSubmit}
      />
      <BudgetTable
        transactions={transactions}
        budgetCategories={budgetCategories}
        handleCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />
      <h2>Suggested Budget Categories</h2>
      <ul>
        {suggestedCategories.map((category) => (
          <li key={category.name}>
            {category.name} ({category.percentage}%)
          </li>
        ))}
      </ul>
    </div>
  );
}