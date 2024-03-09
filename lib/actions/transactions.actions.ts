import { connectToDatabase } from "../database";
import { ITransaction } from "../database/models/transaction.model";

export const getTransactions = async () => {
    try {
        console.log("Fetching transactions from the database");
        const mongoose = await connectToDatabase();
        const collection = mongoose.connection.collection('transactions');
        const transactions = await collection.find().toArray();
        console.log('Transactions fetched successfully!');
        return transactions;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw new Error('Error fetching transactions');
    }
}
