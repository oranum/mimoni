import { useState } from 'react';
import { ITransaction } from '../database/models/transaction.model';

/**
 * A custom hook to handle editing a transaction.
 *
 * @param defaultTransaction - The default transaction object to initialize the state.
 * @returns - Returns the current transaction state and a function to update specific fields in the transaction.
 */
const useEditTransaction = (defaultTransaction: ITransaction): [ITransaction, (key: keyof ITransaction, value: any) => void] => {
    const [transaction, setTransaction] = useState<ITransaction>(defaultTransaction);

    /**
     * Updates a specific field in the transaction.
     *
     * @param key - The field key to update in the transaction object.
     * @param value - The new value for the specified key.
     */
    const updateTransaction = (key: keyof ITransaction, value: any) => {
        setTransaction((prevTransaction) => ({
            ...prevTransaction,
            [key]: value,
        }));
    };

    return [transaction, updateTransaction] as const;
};

export default useEditTransaction;