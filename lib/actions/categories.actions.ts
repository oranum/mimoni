'use server'
import { connectToDatabase } from "../database";
import { ICategory } from "../database/models/category.model";
import { ICategoryFilter } from "../database/models/categoryFilter.model";
import { ITransaction } from "../database/models/transaction.model";
import checkFilter from "../logic/checkFilter";
import { useGetFilters } from "../query-hooks/Filters";
import { getAllFilters } from "./filters.actions";

const getCollection = async () => {
    const mongoose = await connectToDatabase();
    return mongoose.connection.collection<ICategory>('categories');
}


export const getCategoryList = async (asString = false) => {
    try {
        const collection = await getCollection();

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
        const collection = await getCollection();
        const result = await collection.insertOne(category);
        console.log('Category created successfully!');
        return result;

    } catch (error) {
        console.error('Error creating Category:', error);
        throw new Error('Error creating Category');
    }
}


export const calcAutoCategory = (transaction: ITransaction, filtersArray?: ICategoryFilter[]) => {
    filtersArray = filtersArray || useGetFilters().filters;
    for (const filter of filtersArray) {
        const result = checkFilter(filter, transaction);
        if (result) {
            return filter.category;
        }
    }
    return null;
}


export const calcAutoCatMapBulk = (transactions: ITransaction[]) => {
    let results = new Map<string, ICategory | null>()
    // let results: { hash: string, category: ICategory | null }
    const { filters } = useGetFilters();
    for (const transaction of transactions) {
        const result = calcAutoCategory(transaction, filters);
        results.set(transaction.hash, result);
    }
    return results;
}