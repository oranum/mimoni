import { ITransaction } from '@/lib/database/models/transaction.model';

export function useCreateTransactionVairables(transactions: ITransaction[], selectedMonth: Date) {
    const monthlyTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction._calibratedDate);
        return transactionDate.getFullYear() === selectedMonth.getFullYear() && transactionDate.getMonth() === selectedMonth.getMonth();
    });

    const monthlyPendingAmount = monthlyTransactions.filter((t) => !t._isApproved).length;
    const monthlyRelevantTransactions = monthlyTransactions.filter((t) => t._isApproved && t._type !== 'ignore');
    // const allRelevantTransactions = transactions.filter((t) => t._isApproved && t._type !== 'ignore');
    const rangeRelevantTransactions = getRangeTransactions(selectedMonth, transactions).filter((t) => t._isApproved && t._type !== 'ignore');

    return {
        monthlyRelevantTransactions,
        monthlyPendingAmount,
        rangeRelevantTransactions
    };
}

export function calcMonthsDifference(inputDate: Date) {
    const today = new Date();
    const givenDate = new Date(inputDate);
    const yearsDifference = today.getFullYear() - givenDate.getFullYear();
    const monthsDifference = today.getMonth() - givenDate.getMonth();
    const totalMonthsDifference = yearsDifference * 12 + monthsDifference;
    return totalMonthsDifference;
}

function getRangeTransactions(selectedMonth: Date, transactions: ITransaction[]) {
    const monthsDifference = Math.min(calcMonthsDifference(selectedMonth), 5);
    const startMonth = new Date(selectedMonth);
    startMonth.setMonth(selectedMonth.getMonth() - (6 + monthsDifference));
    const endMonth = new Date(selectedMonth);
    endMonth.setMonth(selectedMonth.getMonth() + (5 - monthsDifference));
    const filteredTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t._calibratedDate);
        return transactionDate >= startMonth && transactionDate <= endMonth;
    });

    return filteredTransactions;
}
