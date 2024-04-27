'use server'
import { Filter } from "mongodb";
import { connectToDatabase } from "../database";
import { ITransaction } from "../database/models/transaction.model";

export const getTransactions = async (monthsToGet?: number) => {
    try {
        console.log("Fetching transactions from the database");
        const mongoose = await connectToDatabase();
        console.log("Connected to the database");
        const collection = mongoose.connection.collection<ITransaction>('transactions');

        let query = {}
        if (monthsToGet) {
            const today = new Date();
            const fromDate = new Date();
            fromDate.setMonth(fromDate.getMonth() - monthsToGet)
            fromDate.setDate(1);
            query = {
                _calibratedDate: {
                    $gte: fromDate,
                    $lt: today
                }
            };
        }
        const transactions = await collection.find(query).toArray();


        console.log('Transactions fetched successfully!');
        return transactions;

    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw new Error('Error fetching transactions');
    }
}

export const updateTransaction = async (transaction: ITransaction) => {

    try {
        console.log('transaction to be updated:')
        console.log(transaction)
        // const transaction = await JSON.parse(transactionJSON);


        const mongoose = await connectToDatabase();
        console.log('Connected to the database');
        const collection = mongoose.connection.collection<ITransaction>('transactions');
        const { _id, ...transactionWithoutId } = transaction;
        // const objectId = new mongoose.Types.ObjectId(transaction._id)
        await collection.updateOne({ _id: transaction._id }, { $set: transactionWithoutId });
        console.log('Transaction updated successfully!');
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw new Error('Error updating transaction');
    }
}

