'use server'
import { UpdateOneModel } from "mongodb";
import { connectToDatabase } from "../database";
import Transaction, { ITransaction } from "../database/models/transaction.model";


//get the raw data of the JSON file from caspion
//parse the data into an array of transactions
//upload the transactions to the database



type bulkOperations = {
    updateOne?: UpdateOneModel<any>
}[]

export const uploadTransactions = async (transactions: ITransaction[]) => {
    try {
        const connection = await connectToDatabase();
        const bulkOperations: bulkOperations = []
        for (const transactionData of transactions) {
            const transaction = new Transaction(transactionData);
            const filter = { hash: transaction.hash };
            const update = { $setOnInsert: transaction };
            bulkOperations.push({
                updateOne: {
                    filter,
                    update,
                    upsert: true
                }
            });
        }
        connection.collection('transactions').bulkWrite(bulkOperations);
    }
    catch {
        throw new Error('Error uploading transactions');
    }
}