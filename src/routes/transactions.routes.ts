import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import multer from 'multer';
// import parser from 'csv-parse';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';
import Transaction from '../models/Transaction';

const transactionsRouter = Router();
const upload = multer();

transactionsRouter.get('/', async (request, response) => {
  try {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transactions = await transactionsRepository.find();

    const balance = await transactionsRepository.getBalance();
    return response.status(200).json({ transactions, balance });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;

    const createTransaction = new CreateTransactionService();

    const transaction = await createTransaction.execute({
      title,
      type,
      value,
      category,
    });

    return response.status(201).json(transaction);
  } catch (err) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    const deleteTransaction = new DeleteTransactionService();

    await deleteTransaction.execute({ id });

    return response.status(204).send();
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    try {
      const { file } = request;

      console.log(file);

      const transactions: Transaction[] = [];

      transactions;

      return response.json({ filename: file.originalname });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
);

export default transactionsRouter;
