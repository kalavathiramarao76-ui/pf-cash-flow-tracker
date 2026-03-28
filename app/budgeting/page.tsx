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
      const predictedCategoryIndex = tf.argMax(predictions, 1).dataSync()[0];
      transaction.category = budgetCategories[predictedCategoryIndex].name;
      return transaction;
    }
    return transaction;
  };

  const suggestBudgetCategories = (transactions: Transaction[]): BudgetCategory[] => {
    if (mlModel) {
      const transactionDescriptions = transactions.map((transaction) => transaction.description);
      const predictions = mlModel.predict(tf.tensor2d(transactionDescriptions));
      const predictedCategoryIndices = tf.argMax(predictions, 1).dataSync();
      const suggestedCategories: BudgetCategory[] = [];
      predictedCategoryIndices.forEach((index, i) => {
        const category = budgetCategories[index];
        if (category) {
          suggestedCategories.push(category);
        } else {
          suggestedCategories.push({ name: 'Unknown', amount: 0 });
        }
      });
      return suggestedCategories;
    }
    return [];
  };

  const trainModel = async () => {
    if (mlModel) {
      const trainingDataTensor = tf.tensor2d(trainingData.map((transaction) => transaction.description.split(' ')));
      const validationDataTensor = tf.tensor2d(validationData.map((transaction) => transaction.description.split(' ')));
      const labelsTensor = tf.tensor2d(trainingData.map((transaction) => budgetCategories.findIndex((category) => category.name === transaction.category)));
      await mlModel.fit(trainingDataTensor, labelsTensor, {
        epochs: 100,
        validationData: [validationDataTensor, labelsTensor],
      });
      const accuracy = mlModel.evaluate(validationDataTensor, labelsTensor);
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
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
      />
    </div>
  );
}