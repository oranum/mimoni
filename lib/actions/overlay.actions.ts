import mongoose from 'mongoose';
import { connectToDatabase } from '../database';
import { ICategory } from '../database/models/category.model';
import { ITransaction } from '../database/models/transaction.model';
import { useGetOverlayRules } from '../query-hooks/OverlayRules';

const getCollection = async () => {
    const mongoose = await connectToDatabase();
    return mongoose.connection.collection<ICategory>('categories');
};

const { rules, isLoading, error } = useGetOverlayRules();

type overlayHash = {
    [key: string]: {
        _category?: ICategory;
        _type?: 'include' | 'ignore' | 'fixed' | 'dynamic';
        _note?: string;
        _tags?: string[];
    };
};

// export const updateTransactionAction = async (transaction: ITransaction) => {
//     try {
//         const collection = await getCollection();
//         const { _id, ...transactionWithoutId } = transaction;
//         const objectId = new mongoose.Types.ObjectId(transaction._id); // Convert objectId to string
//         //@ts-ignore - updateOne method _id property causing conflict but this is the only way it works on the db
//         const result = await collection.updateOne({ _id: objectId }, { $set: transactionWithoutId });
//         result.matchedCount === 1 ? console.log('Transaction updated successfully!') : console.log('****Transaction not found****');
//     } catch (error) {
//         console.error('Error updating transaction:', error);
//         throw new Error('Error updating transaction');
//     }
// };
