'use server'

import mongoose, { Connection } from "mongoose";
import { connectToDatabase } from "../database";
import Transaction, { ITransaction } from "../database/models/transaction.model";
import { UpdateOneModel } from "mongodb";

export const uploadTransactions = async (transactions: ITransaction[]) => {
    try {
        console.log("uploadTransactions function is trying to connect to the database")
        const connection: Connection = await connectToDatabase();
        const bulkOperations = [];

        for (const transactionData of transactions) {
            const filter = { hash: transactionData.hash };
            const update = { $setOnInsert: transactionData };

            bulkOperations.push({
                updateOne: {
                    filter,
                    update,
                    upsert: true
                }
            });
        }
        console.log("uploadTransactions function is trying to bulkOperation")

        await connection.collection('transactions').bulkWrite(bulkOperations)
        console.log('Transactions uploaded successfully!');
    } catch (error) {
        console.error('Error uploading transactions:', error);
        throw new Error('Error uploading transactions');
    }
}
