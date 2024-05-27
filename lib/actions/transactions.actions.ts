'use server'
import { Filter } from "mongodb";
import { connectToDatabase } from "../database";
import { ITransaction } from "../database/models/transaction.model";


export const getTransactions = async (monthsToGet?: number, onlyApproved?: boolean, onlyNotIgnored?: boolean, query?: Filter<ITransaction>) => {
    try {
        console.log("Fetching transactions from the database");
        const mongoose = await connectToDatabase();
        console.log("Connected to the database");
        const collection = mongoose.connection.collection<ITransaction>('transactions');


        query = query || {};
        if (monthsToGet) {
            const today = new Date();
            const fromDate = new Date();
            fromDate.setMonth(fromDate.getMonth() - monthsToGet)
            fromDate.setDate(1);
            query._calibratedDate = {
                $gte: fromDate,
                $lt: today
            }

        }
        if (onlyApproved) {
            query._isApproved = { $eq: true }
        }
        if (onlyNotIgnored) {
            query._ignore = { $eq: false }
        }

        const transactions = await collection.find(query).toArray();

        console.log('Transactions fetched successfully!');
        console.log("found " + transactions.length + " transactions")

        return JSON.parse(JSON.stringify(transactions));

    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw new Error('Error fetching transactions');
    }
}

export const updateTransactionAction = async (transaction: ITransaction) => {

    try {
        const mongoose = await connectToDatabase();
        console.log('Connected to the database');
        const collection = mongoose.connection.collection<ITransaction>('transactions');
        const { _id, ...transactionWithoutId } = transaction;
        const objectId = new mongoose.Types.ObjectId(transaction._id) // Convert objectId to string
        //@ts-ignore - updateOne method _id property causing conflict but this is the only way it works on the db
        const result = await collection.updateOne({ _id: objectId }, { $set: transactionWithoutId });
        result.matchedCount === 1 ? console.log('Transaction updated successfully!') : console.log('****Transaction not found****');
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw new Error('Error updating transaction');
    }
}

export const updateTransactionField = async (value: any, hash: string, field: string) => {
    try {
        console.log('transaction field to be updated:')
        console.log(field)
        console.log(value)
        const mongoose = await connectToDatabase();
        const collection = mongoose.connection.collection<ITransaction>('transactions');
        //@ts-ignore - updateOne method _id property causing conflict but this is the only way it works on the db
        const result = await collection.updateOne({ hash }, { $set: { [field]: value } });
        result.matchedCount === 1 ? console.log('Transaction updated successfully!') : console.log('****Transaction not found****');
    } catch (error) {
        console.error('Error updating transaction:', error);
        throw new Error('Error updating transaction');
    }
}




export const getNumberOfInboxTransactions = async () => {
    try {
        console.log("Fetching number of inbox transactions from the database")
        const mongoose = await connectToDatabase();
        const collection = mongoose.connection.collection<ITransaction>('transactions');
        const query = { _isApproved: false }
        const numberOfInboxTransactions = await collection.countDocuments(query);
        console.log('Number of inbox transactions fetched successfully!' + numberOfInboxTransactions);
        return numberOfInboxTransactions

    } catch (error) {
        console.error('Error fetching number of inbox transactions:', error);
        throw new Error('Error fetching number of inbox transactions');
    }
}