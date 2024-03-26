'use server'
import { connectToDatabase } from "../database";
import { ICategoryFilter } from "../database/models/categoryFilter.model";
import { ITransaction } from "../database/models/transaction.model";

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


export const setCategoryFilter = async (filter: ICategoryFilter) => {
    try {
        console.log('filter to be set:')
        console.log(filter)
        const mongoose = await connectToDatabase();
        console.log('Connected to the database');
        const collection = mongoose.connection.collection<ICategoryFilter>('CategoryFilters');
        await collection.insertOne(filter);
        console.log('Filter set successfully!');
    } catch (error) {
        console.error('Error setting filter:', error);
        throw new Error('Error setting filter');
    }

}




