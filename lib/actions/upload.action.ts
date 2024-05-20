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
            _ignore: false,
            _category: null,
            _calibratedAmount: transaction.chargedAmount,
            _originalAmount: transaction.originalAmount,

        }
    }

    const mutatedTransactions = transactions.map(mutateTransaction);

    try {
        console.log("uploadTransactions function is trying to connect to the database")
        const mongoose = await connectToDatabase();
        const bulkOperations = [];

        // Assuming YourModel represents your Mongoose model
        const uniqueHashes = new Set(); // Set to store unique hashes

        for (const transaction of mutatedTransactions) {
            if (!uniqueHashes.has(transaction.hash)) {
                uniqueHashes.add(transaction.hash);

                const filter = { hash: transaction.hash };
                const update = {
                    $setOnInsert: transaction // Include $setOnInsert for insert if not exists
                };

                bulkOperations.push({
                    updateOne: {
                        filter,
                        update,
                        upsert: true // Use upsert to insert if not found
                    }
                });
            }
        }

        // Perform bulk write for unique items
        if (bulkOperations.length > 0) {
            const result = await Transaction.bulkWrite(bulkOperations);
            const count = result.upsertedCount;
            const message = count ? `נוספו ${result.upsertedCount} תנועות חדשות` : "אין תנועות חדשות להוספה";
            return message;
        }
        return "No new transactions"
    } catch (error) {
        console.error("Error in uploadTransactions:", error);
    }
}
