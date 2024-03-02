import { connectToDatabase } from "../database";
import Transaction, { ITransaction } from "../database/models/transaction.model";
import { UpdateOneModel } from "mongodb";

type BulkOperation = {
    updateOne?: UpdateOneModel<any>;
}[];

export const uploadTransactions = async (transactions: ITransaction[]) => {
    try {
        const connection = await connectToDatabase();
        const bulkOperations: BulkOperation = [];

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

        await connection.collection('transactions').bulkWrite(bulkOperations);
        console.log('Transactions uploaded successfully!');
    } catch (error) {
        console.error('Error uploading transactions:', error);
        throw new Error('Error uploading transactions');
    }
}
