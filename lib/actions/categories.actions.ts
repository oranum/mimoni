'use server'
import { connectToDatabase } from "../database";
import { ICategory } from "../database/models/category.model";
import { ICategoryFilter } from "../database/models/categoryFilter.model";
import { ITransaction } from "../database/models/transaction.model";
import checkFilter from "../logic/checkFilter";
import { getAllFilters } from "./filters.actions";

export const getCategoryList = async (asString = true) => {
    try {
        console.log("Fetching categories from the database");
        const mongoose = await connectToDatabase();
        console.log("Connected to the database");
        const collection = mongoose.connection.collection<ICategory>('categories');
        const categories = (await collection.find().toArray())

        const withoutId: ICategory[] = categories.map((category) => {
            const { _id, ...categoryWithoutId } = category;
            return categoryWithoutId;
        })

        console.log('Categories fetched successfully!');
        const returnValue = asString ? withoutId.map(category => category.name) : withoutId;
        return returnValue;

    } catch (error) {
        console.error('Error fetching Categories:', error);
        throw new Error('Error fetching Categories');
    }
}


export const createCategoryAction = async (category: ICategory) => {
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


export const findAutoCategory = async (transaction: ITransaction, filtersArray?: ICategoryFilter[]) => {
    try {
        filtersArray = filtersArray || await getAllFilters();
        for (const filter of filtersArray) {
            const result = checkFilter(filter, transaction);
            if (result) {
                return filter.category;
            }
        }
        return null;
    }
    catch (error) {
        console.error('Error finding auto category:', error);
        throw new Error('Error finding auto category');
    }
}

export const findAutoCategoryBulk = async (transactions: ITransaction[]) => {
    let results = new Map<string, ICategory | null>()
    // let results: { hash: string, category: ICategory | null }
    const filtersArray = await getAllFilters();
    for (const transaction of transactions) {
        const result = await findAutoCategory(transaction, filtersArray);
        results.set(transaction.hash, result);
    }
    return results;
}