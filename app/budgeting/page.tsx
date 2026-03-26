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
      model.compile({ optimizer: tf.optimizers.adam(), loss: 'categoricalCrossentropy', metrics: ['accuracy'] });
      const input = tf.tensor2d(transaction.description.split(' ').map(word => word.charCodeAt(0)));
      const output = model.predict(input);
      const categoryIndex = tf.argMax(output, 1).dataSync()[0];
      const category = budgetCategories[categoryIndex];
      return { ...transaction, category: category?.name || 'Uncategorized' };
    } else {
      const category = budgetCategories.find(category => category.name === transaction.category);
      return { ...transaction, category: category?.name || 'Uncategorized' };
    }
  };

  const trainModel = async () => {
    if (mlModel) {
      const trainingInputs = trainingData.map(transaction => transaction.description.split(' ').map(word => word.charCodeAt(0)));
      const trainingOutputs = trainingData.map(transaction => {
        const categoryIndex = budgetCategories.findIndex(category => category.name === transaction.category);
        return categoryIndex !== -1 ? categoryIndex : 0;
      });
      const validationInputs = validationData.map(transaction => transaction.description.split(' ').map(word => word.charCodeAt(0)));
      const validationOutputs = validationData.map(transaction => {
        const categoryIndex = budgetCategories.findIndex(category => category.name === transaction.category);
        return categoryIndex !== -1 ? categoryIndex : 0;
      });

      const trainingInputTensor = tf.tensor2d(trainingInputs);
      const trainingOutputTensor = tf.tensor1d(trainingOutputs, 'int32');
      const validationInputTensor = tf.tensor2d(validationInputs);
      const validationOutputTensor = tf.tensor1d(validationOutputs, 'int32');

      await mlModel.fit(trainingInputTensor, trainingOutputTensor, {
        epochs: 100,
        validationData: [validationInputTensor, validationOutputTensor],
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            setModelAccuracy(logs.val_accuracy);
          },
        },
      });
    }
  };

  const suggestBudgetCategories = (transactions: Transaction[]) => {
    if (mlModel) {
      const inputs = transactions.map(transaction => transaction.description.split(' ').map(word => word.charCodeAt(0)));
      const inputTensor = tf.tensor2d(inputs);
      const outputs = mlModel.predict(inputTensor);
      const categoryIndices = tf.argMax(outputs, 1).dataSync();
      return categoryIndices.map((index, i) => {
        const category = budgetCategories[index];
        return { name: category?.name || 'Uncategorized', transactions: [transactions[i]] };
      });
    } else {
      return transactions.map(transaction => {
        const category = budgetCategories.find(category => category.name === transaction.category);
        return { name: category?.name || 'Uncategorized', transactions: [transaction] };
      });
    }
  };

  return (
    <div>
      <BudgetForm onBudgetSubmit={handleBudgetSubmit} />
      <BudgetTable transactions={transactions} budgetCategories={budgetCategories} categorizeTransaction={categorizeTransaction} />
      {modelAccuracy !== null && <p>Model Accuracy: {modelAccuracy.toFixed(2)}</p>}
    </div>
  );
}