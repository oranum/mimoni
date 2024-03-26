'use server'
import { connectToDatabase } from "../database";
import { ICategory } from "../database/models/category.model";
import { ITransaction } from "../database/models/transaction.model";

export const getCategoryList = async () => {
    try {
        console.log("Fetching categories from the database");
        const mongoose = await connectToDatabase();
        console.log("Connected to the database");
        const collection = mongoose.connection.collection<ICategory>('categories');
        const categories = (await collection.find().toArray())
        // .map((transaction) => {
        //     const { _id, ...transactionWithoutId } = transaction;
        //     return transactionWithoutId;
        // });

        console.log('Categories fetched successfully!');
        return categories;

    } catch (error) {
        console.error('Error fetching Categories:', error);
        throw new Error('Error fetching Categories');
    }
}


export const createCategory = async (category: ICategory) => {
    try {
        console.log("Creating category in the database");
        const mongoose = await connectToDatabase();
        console.log("Connected to the database");
        const collection = mongoose.connection.collection<ICategory>('categories');
        const result = await collection.insertOne(category);
        console.log('Category created successfully!');
        return result;

    } catch (error) {
        console.error('Error creating Category:', error);
        throw new Error('Error creating Category');
    }
}


