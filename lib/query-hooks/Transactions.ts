'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTransactions, updateTransactionAction } from "../actions/transactions.actions";
import { ITransaction } from "../database/models/transaction.model";
import { useToast } from "@/components/ui/use-toast";



export const useGetTransactions = (monthsToGet?: number) => {
    const { data, isLoading, error, ...rest } = useQuery({
        queryKey: ['transactions', ...(monthsToGet ? [monthsToGet.toString()] : [])],
        queryFn: () => getTransactions(monthsToGet)
    })
    return {
        transactions: data as ITransaction[] || [],
        isLoading,
        error,
        ...rest,
    };
};



export const useSetTransaction = () => {
    const { toast } = useToast()
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:
            (transaction) => {
                return updateTransactionAction(transaction)
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
            console.log('mutate is setting query data')
            queryClient.setQueryData<ITransaction[]>(['transactions'], old => {
                return old?.map(t => t._id === transaction._id ? transaction : t) || old
            })
            return { previousTransactions };
        },
        onError: (err, newTransaction, context) => {
            toast({ title: "Error updating transaction", description: "Error updating transaction", duration: 1500 })
            if (context?.previousTransactions) {
                queryClient.setQueryData(['transactions'], context.previousTransactions);
            }

        },
        onSettled: () => {
            console.log('Transaction updated, refetching transactions')
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });

}
