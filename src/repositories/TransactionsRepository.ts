/* eslint-disable no-param-reassign */
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balance = this.transactions.reduce(
      (accum: Balance, curr: Transaction) => {
        switch (curr.type) {
          case 'income':
            accum.income += curr.value;
            break;
          case 'outcome':
            accum.outcome += curr.value;
            break;
          default:
            break;
        }

        return accum;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    balance.total = balance.income - balance.outcome;

    return balance;
  }

  public create({ title, type, value }: CreateTransactionDTO): Transaction {
    if (type === 'outcome') {
      const curr = this.getBalance();
      const checkBalance = curr.income - (curr.outcome + value);

      if (checkBalance < 0) {
        throw Error('Value of outcome is insufficient');
      }
    }

    const transaction = new Transaction({ title, type, value });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
