'use server'

import mongoose, { Connection } from "mongoose";
import { connectToDatabase } from "../database";
import Transaction, { ITransaction } from "../database/models/transaction.model";
import { UpdateOneModel } from "mongodb";




export const uploadTransactions = async (transactions: ITransaction[]) => {

    function mutateTransaction(transaction: ITransaction) {
        return {
            ...transaction,
            _calibratedDate: new Date(transaction.date),
            _isApproved: false,
            _createdAt: new Date(),
            _isProcessed: true,
            _lastUpdated: new Date(),
        }
    }

    const mutatedTransactions = transactions.map(mutateTransaction);

    try {
        console.log("uploadTransactions function is trying to connect to the database")
        const mongoose = await connectToDatabase();
        const bulkOperations = [];

        for (const transaction of mutatedTransactions) {
            const filter = { hash: transaction.hash };
            const update = {

                $setOnInsert: transaction // Include $setOnInsert for insert if not exists
            };

            bulkOperations.push({
                updateOne: {
                    filter,
                    update,
                    upsert: true
                }
            });
        }

        console.log("uploadTransactions function is trying to bulkwrite")



        const collection = mongoose.connection.collection('transactions');
        await collection.bulkWrite(bulkOperations)



        console.log('Transactions uploaded successfully!');
    } catch (error) {
        console.error('Error uploading transactions:', error);
        throw new Error('Error uploading transactions');
    }
}
