'use client'

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTransactions, updateTransactionAction } from "../actions/transactions.actions";
import { ITransaction } from "../database/models/transaction.model";
import { Variable } from "lucide-react";
import { error } from "console";
import { useToast } from "@/components/ui/use-toast";



export const useGetTransactions = () => {
    const { data, isLoading, error, ...rest } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => getTransactions()
    })
    return {
        transactions: data as ITransaction[],
        isLoading,
        error,
        ...rest,
    };
};




const useUpdateTransaction = () => {
    const { toast } = useToast()
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:
            // (transaction) => updateTransactionAction(transaction),
            () => {
                return new Promise((_, reject) => {
                    setTimeout(() => {
                        reject(new Error('Error thrown after 1 second'));
                    }, 1000);
                });
            },
        onMutate: async (transaction: ITransaction) => {
            await queryClient.cancelQueries({ queryKey: ['transactions'] });

            const previousTransactions = queryClient.getQueryData<ITransaction[]>(['transactions']);
            console.log('mutate is setting query data')
            queryClient.setQueryData<ITransaction[]>(['transactions'], old => {
                return old?.map(t => t._id === transaction._id ? transaction : t) || []
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

export default useUpdateTransaction