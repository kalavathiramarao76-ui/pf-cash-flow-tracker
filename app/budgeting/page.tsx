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
        const model = await tf.loadLayersModel('https://example.com/model.json');
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
      const model = tf.sequential();
      model.add(embeddingLayer);
      model.add(sequenceLayer);
      model.add(denseLayer);
      const predictions = model.predict(tf.tensor2d([transaction.description.split(' ')]));
      const predictedCategoryIndex = predictions.argMax(1).dataSync()[0];
      transaction.category = budgetCategories[predictedCategoryIndex].name;
      return transaction;
    }
    return transaction;
  };

  const suggestBudgetCategories = (transactions: Transaction[]): BudgetCategory[] => {
    const categories: BudgetCategory[] = [];
    const categoryCounts: { [category: string]: number } = {};
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
      categories.push({
        name: category,
        budget: percentage,
      });
    });
    return categories;
  };

  const trainModel = async () => {
    if (mlModel) {
      const trainingInputs = trainingData.map((transaction) => transaction.description.split(' '));
      const trainingLabels = trainingData.map((transaction) => budgetCategories.findIndex((category) => category.name === transaction.category));
      const validationInputs = validationData.map((transaction) => transaction.description.split(' '));
      const validationLabels = validationData.map((transaction) => budgetCategories.findIndex((category) => category.name === transaction.category));
      const trainingTensor = tf.tensor2d(trainingInputs, [trainingInputs.length, trainingInputs[0].length]);
      const trainingLabelTensor = tf.tensor1d(trainingLabels, 'int32');
      const validationTensor = tf.tensor2d(validationInputs, [validationInputs.length, validationInputs[0].length]);
      const validationLabelTensor = tf.tensor1d(validationLabels, 'int32');
      await mlModel.fit(trainingTensor, trainingLabelTensor, {
        epochs: 100,
        validationData: [validationTensor, validationLabelTensor],
      });
      const accuracy = mlModel.evaluate(validationTensor, validationLabelTensor);
      setModelAccuracy(accuracy);
    }
  };

  return (
    <div>
      <BudgetForm
        budgetCategories={budgetCategories}
        handleBudgetSubmit={handleBudgetSubmit}
        suggestedCategories={suggestedCategories}
      />
      <BudgetTable
        transactions={transactions}
        budgetCategories={budgetCategories}
        handleCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}