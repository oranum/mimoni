'use server'
import { connectToDatabase, getCollection } from "../database";
import { ICategory } from "../database/models/category.model";
import { ICategoryFilter } from "../database/models/categoryFilter.model";
import { ITransaction } from "../database/models/transaction.model";
import checkRule from "../logic/checkOverlayRule";
import { useGetOverlayRules } from "../query-hooks/OverlayRules";
import { getAllOverlayRules } from "./filters.actions";

// const getCollection = async () => {
//     const mongoose = await connectToDatabase();
//     return mongoose.connection.collection<ICategory>('categories');
// }


export const getCategoryList = async (asString = false) => {
    try {
        const collection = await getCollection<ICategory>('categories');

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
        const collection = await getCollection<ICategory>('categories');
        const result = await collection.insertOne(category);
        console.log('Category created successfully!');
        return result;

    } catch (error) {
        console.error('Error creating Category:', error);
        throw new Error('Error creating Category');
    }
}

