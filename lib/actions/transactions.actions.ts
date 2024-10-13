'use server';
import { Filter } from 'mongodb';
import { connectToDatabase } from '../database';
import { ITransaction } from '../database/models/transaction.model';
import { get } from 'http';
import { id } from 'date-fns/locale';

const getTransactionsCollection = async () => {
    const mongoose = await connectToDatabase();
    return mongoose.connection.collection<ITransaction>('transactions');
};

export const getTransactions = async (monthsToGet?: number, onlyApproved?: boolean, onlyNotIgnored?: boolean, query?: Filter<ITransaction>) => {
    try {
        const collection = await getTransactionsCollection();
        query = query || {};
        if (monthsToGet) {
            const today = new Date();
            const fromDate = new Date();
            fromDate.setMonth(fromDate.getMonth() - monthsToGet);
            fromDate.setDate(1);
            query._calibratedDate = {
                $gte: fromDate,
                $lt: today,
            };
        }
        if (onlyApproved) {
            query._isApproved = { $eq: true };
        }
        if (onlyNotIgnored) {
            query._ignore = { $eq: false };
        }

        const transactions = await collection.find(query).toArray();

        console.log('Transactions fetched successfully!');
        console.log('found ' + transactions.length + ' transactions');

        return JSON.parse(JSON.stringify(transactions));
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw new Error('Error fetching transactions');
    }
};

export const updateTransactionAction = async (transaction: ITransaction) => {
    try {
        const mongoose = await connectToDatabase();
        const collection = await getTransactionsCollection();
        const { _id, ...transactionWithoutId } = transaction;
        const objectId = new mongoose.Types.ObjectId(transaction._id); // Convert objectId to string
        //@ts-ignore - updateOne method _id property causing conflict but this is the only way it works on the db
        const result = await collection.updateOne({ _id: objectId }, { $set: transactionWithoutId });
        result.matchedCount === 1 ? console.log('Transaction updated successfully!') : console.log('****Transaction not found****');
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw new Error('Error updating transaction');
    }
};

export const updateTransactionField = async (value: any, hash: string, field: string) => {
    try {
        const collection = await getTransactionsCollection();
        //@ts-ignore - updateOne method _id property causing conflict but this is the only way it works on the db
        const result = await collection.updateOne({ hash }, { $set: { [field]: value } });
        result.matchedCount === 1 ? console.log('Transaction updated successfully!') : console.log('****Transaction not found****');
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw new Error('Error updating transaction');
    }
};

export const createChildTransactionAction = async (transaction: ITransaction) => {
    try {
        const collection = await getTransactionsCollection();
        const result = await collection.insertOne(transaction);
        console.log('Child transaction created successfully!');
        return result.insertedId;
    } catch (error) {
        console.error('Error creating child transaction:', error);
        throw new Error('Error creating child transaction');
    }
};

export const deleteTransactionAction = async (id: string) => {
    try {
        const collection = await getTransactionsCollection();
        const result = await collection.deleteOne({ _id: id });
        result.deletedCount === 1 ? console.log('Transaction deleted successfully!') : console.log('****Transaction not found****');
    } catch (error) {
        console.error('Error deleting transaction:', error);
        throw new Error('Error deleting transaction');
    }
};

export const getNumberOfInboxTransactions = async () => {
    try {
        const collection = await getTransactionsCollection();
        const query = { _isApproved: false };
        const numberOfInboxTransactions = await collection.countDocuments(query);
        console.log('Number of inbox transactions fetched successfully!' + numberOfInboxTransactions);
        return numberOfInboxTransactions;
    } catch (error) {
        console.error('Error fetching number of inbox transactions:', error);
        throw new Error('Error fetching number of inbox transactions');
    }
};
