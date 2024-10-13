'use server';
import { connectToDatabase } from '../database';
import { ICategoryFilter } from '../database/models/categoryFilter.model';
import { IOverlayRule } from '../database/models/overlayRule.model';
import { ITransaction } from '../database/models/transaction.model';
import { getCollection } from '../database';

// export const getFilter = async () => {
//     try {
//         console.log("Fetching transactions from the database");
//         const mongoose = await connectToDatabase();
//         console.log("Connected to the database");
//         const collection = mongoose.connection.collection<ITransaction>('transactions');
//         const transactions = (await collection.find().toArray())
//         // .map((transaction) => {
//         //     const { _id, ...transactionWithoutId } = transaction;
//         //     return transactionWithoutId;
//         // });

//         console.log('Transactions fetched successfully!');
//         return transactions;

//     } catch (error) {
//         console.error('Error fetching transactions:', error);
//         throw new Error('Error fetching transactions');
//     }
// }

export const setOverlayRule = async (rule: IOverlayRule) => {
    try {
        console.log('rule to be set:');
        console.log(rule);
        const collection = await getCollection<IOverlayRule>('rules');
        await collection.insertOne(rule);
        console.log('rule set successfully!');
    } catch (error) {
        console.error('Error setting rule:', error);
        throw new Error('Error setting rule');
    }
};

export const getAllOverlayRules = async () => {
    try {
        console.log('Fetching rules from the database');
        const mongoose = await connectToDatabase();
        console.log('Connected to the database');
        const collection = mongoose.connection.collection<IOverlayRule>('rules');
        const rules = await collection.find().toArray();

        console.log('rules fetched successfully!');
        return rules;
    } catch (error) {
        console.error('Error fetching rules:', error);
        throw new Error('Error fetching rules');
    }
};
