import { ICategory } from "@/lib/database/models/category.model";
import { ITransaction } from "@/lib/database/models/transaction.model";
import { useGetFilters } from "@/lib/query-hooks/Filters";

const { filters, isLoading, error } = useGetFilters();


type overlayHash = {
    [key: string]: {
        _category?: ICategory;
        _type?: 'include' | 'ignore' | 'fixed' | 'dynamic';
        _note?: string;
        _tags?: string[];
    };
};


const createOverlay:overlayHash = (transactions: ITransaction[])=>
{

    transactions.forEach(transaction => {



}




export const calcAutoCategory = (transaction: ITransaction, filtersArray?: ICategoryFilter[]) => {
    filtersArray = filtersArray || useGetFilters().filters;
    for (const filter of filtersArray) {
        const result = checkRule(filter, transaction);
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