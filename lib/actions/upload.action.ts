'use server'

import mongoose, { Connection } from "mongoose";
import { connectToDatabase } from "../database";
import Transaction, { ITransaction } from "../database/models/transaction.model";
import { UpdateOneModel } from "mongodb";


const exampleTransactionArray =
    [{
        "type": "normal",
        "identifier": 75315176,
        "date": "2023-01-19T22:00:00.000Z",
        "processedDate": "2023-02-01T22:00:00.000Z",
        "originalAmount": -16,
        "originalCurrency": "ILS",
        "chargedAmount": -16,
        "description": "אוהד המוציא לחם בעמ",
        "memo": "",
        "status": "completed",
        "accountNumber": "0989",
        "category": "",
        "hash": "2023-01-19T22:00:00.000Z_-16_אוהד המוציא לחם בעמ__isracard_0989"
    }]

export const uploadTransactions = async (transactions: ITransaction[]) => {
    try {
        console.log("uploadTransactions function is trying to connect to the database")
        const mongoose = await connectToDatabase();
        const bulkOperations = [];

        for (const transactionData of transactions) {
            const filter = { hash: transactionData.hash };
            const update = {

                $setOnInsert: transactionData // Include $setOnInsert for insert if not exists
            };

            bulkOperations.push({
                updateOne: {
                    filter,
                    update,
                    upsert: true
                }
            });
        }
        console.log(bulkOperations)

        console.log("uploadTransactions function is trying to bulkwrite")


        // const newTransaction = await Transaction.create(exampleTransaction)
        const collection = mongoose.connection.collection('transactions');
        await collection.bulkWrite(bulkOperations)



        console.log('Transactions uploaded successfully!');
    } catch (error) {
        console.error('Error uploading transactions:', error);
        throw new Error('Error uploading transactions');
    }
}
