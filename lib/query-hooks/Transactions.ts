'use client';

import { UseMutateFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createChildTransactionAction, deleteTransactionAction, getTransactions, updateTransactionAction } from '../actions/transactions.actions';
import { ITransaction } from '../database/models/transaction.model';
import { useToast } from '@/components/ui/use-toast';

type getType = 'all' | 'approved' | 'pending';
export const useGetTransactions = (getType?: getType, monthsToGet?: number) => {
    const { data, isLoading, error, ...rest } = useQuery({
        queryKey: ['transactions', ...(monthsToGet ? [monthsToGet.toString()] : [])],
        queryFn: () => getTransactions(monthsToGet),
    });
    const filteredTransactions =
        !getType || getType === 'all'
            ? data
            : data?.filter((t: ITransaction) => {
                  if (getType === 'approved') {
                      return t._isApproved;
                  }
                  if (getType === 'pending') {
                      return !t._isApproved;
                  }
                  return true;
              });

    return {
        transactions: (filteredTransactions as ITransaction[]) || [],
        isLoading,
        error,
        ...rest,
    };
};

/**
 * A function to create a setTransaction mutation, that accepts a ITansaction object and updates the transaction in the database.
 * Mutate function also handles the query cache updates and error handling.
 *
 *
 *
 * @returns {UseMutationResult<ITransaction, Error, ITransaction, { previousTransactions?: ITransaction[] }>} -
 * An object containing the mutation state and methods for the transaction.
 *
 * @example
 * const { mutate: setTransaction, status, error, isLoading } = useSetTransaction();
 *
 * // To update a transaction (expects an ITransaction object):
 * setTransaction(updatedTransaction);
 *
 * // Additional properties you can destructure:
 * // - status: The current status of the mutation ('idle', 'loading', 'error', 'success').
 * // - error: Any error that occurred during the mutation.
 * // - isLoading: A boolean indicating if the mutation is currently in progress.
 */
export const useSetTransaction = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (transaction) => {
            return updateTransactionAction(transaction);
        },
        // () => {
        //     return new Promise((_, reject) => {
        //         setTimeout(() => {
        //             reject(new Error('Error thrown after 1 second'));
        //         }, 1000);
        //     });
        // },
        onMutate: async (transaction: ITransaction) => {
            await queryClient.cancelQueries({ queryKey: ['transactions'] });

            const previousTransactions = queryClient.getQueryData<ITransaction[]>(['transactions']);
            console.log('mutate is setting query data');
            queryClient.setQueryData<ITransaction[]>(['transactions'], (old) => {
                return old?.map((t) => (t._id === transaction._id ? transaction : t)) || old;
            });
            return { previousTransactions };
        },
        onError: (err, newTransaction, context) => {
            toast({ title: 'Error updating transaction', description: 'Error updating transaction', duration: 1500 });
            if (context?.previousTransactions) {
                queryClient.setQueryData(['transactions'], context.previousTransactions);
            }
        },
        onSettled: () => {
            console.log('Transaction updated, refetching transactions');
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
};

export const useCreateChildTransaction = () => {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (transaction: ITransaction) => {
            return createChildTransactionAction(transaction);
        },
        onMutate: async (newTransaction: ITransaction) => {
            await queryClient.cancelQueries({ queryKey: ['transactions'] });

            const previousTransactions = queryClient.getQueryData<ITransaction[]>(['transactions']);
            console.log('mutate is setting query data');

            // Add the new transaction to the existing list
            queryClient.setQueryData<ITransaction[]>(['transactions'], (old) => {
                return [...(old || []), newTransaction]; // Add the new transaction
            });

            return { previousTransactions }; // Return context for rollback on error
        },
        onError: (err, newTransaction, context) => {
            toast({ title: 'Error creating transaction', description: 'Error creating transaction', duration: 1500 });
            if (context?.previousTransactions) {
                queryClient.setQueryData(['transactions'], context.previousTransactions);
            }
        },
        onSettled: () => {
            console.log('Transaction created, refetching transactions');
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();

    const { toast } = useToast();
    return useMutation({
        mutationFn: (id: string) => {
            return deleteTransactionAction(id);
        },
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: ['transactions'] });

            const previousTransactions = queryClient.getQueryData<ITransaction[]>(['transactions']);
            console.log('mutate is setting query data');

            // Remove the transaction from the existing list
            queryClient.setQueryData<ITransaction[]>(['transactions'], (old) => {
                return old?.filter((t) => t._id !== id) || old;
            });

            return { previousTransactions }; // Return context for rollback on error
        },
        onError: (err, id, context) => {
            toast({ title: 'Error deleting transaction', description: 'Could not delete the transaction.', duration: 1500 });
            if (context?.previousTransactions) {
                queryClient.setQueryData(['transactions'], context.previousTransactions);
            }
        },
        onSettled: () => {
            console.log('Transaction deleted, refetching transactions');
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
};

type UseTransactionsReturnType = [
    ITransaction[], // transactions
    UseMutateFunction<
        void,
        Error,
        ITransaction,
        {
            previousTransactions: ITransaction[] | undefined;
        }
    >, // setTransactions (mutate function)
    //boolean, // isLoading
    //unknown, // error
    // boolean, // isError
];

export const useTransactions = (): UseTransactionsReturnType => {
    const { transactions, isLoading, error } = useGetTransactions();
    const { mutate: setTransactions, isError } = useSetTransaction();
    return [transactions, setTransactions];
};
