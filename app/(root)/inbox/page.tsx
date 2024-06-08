'use client'

import { use, useEffect, useState, useTransition } from 'react'
import { columns } from './TransactionTable/columns'
import { TransactionsTable } from './TransactionTable/TransactionsTable'
import { getTransactions } from '@/lib/actions/transactions.actions'
import { ITransaction } from '@/lib/database/models/transaction.model'
import { connectToDatabase } from '@/lib/database'
import { Search } from 'lucide-react'
import { calcAutoCatMapBulk, getCategoryList } from '@/lib/actions/categories.actions'
import { ICategory } from '@/lib/database/models/category.model'
import { set } from 'mongoose'
import FilterDialog from '@/components/shared/filterDialog/FilterDialog'
import { Button } from '@/components/ui/button'
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { WithId } from 'mongodb'
import { useGetTransactions } from '@/lib/query-hooks/Transactions'
import { useToast } from '@/components/ui/use-toast'
import { useGetCategories } from '@/lib/query-hooks/Categories'
import { useGetFilters } from '@/lib/query-hooks/Filters'
import { ICategoryFilter } from '@/lib/database/models/categoryFilter.model'
import checkFilter from '@/lib/logic/checkFilter'


const Inbox = () => {



    const calcAutoCategory = (transaction: ITransaction, filtersArray?: ICategoryFilter[]) => {
        filtersArray = filtersArray || useGetFilters().filters;
        for (const filter of filtersArray) {
            const result = checkFilter(filter, transaction);
            if (result) {
                return filter.category;
            }
        }
        return null;
    }


    const calcAutoCatMap = (transactions: ITransaction[], filters: ICategoryFilter[]) => {
        let results = new Map<string, ICategory | undefined>()
        for (const transaction of transactions) {
            for (const filter of filters) {
                const result = checkFilter(filter, transaction);
                if (result) {
                    results.set(transaction.hash, filter.category);
                    break;
                }

            }
        }
        return results;
    }

    const queryClient = useQueryClient()


    // const [transactions, setTransactions] = useState<ITransaction[]>([])

    const { transactions } = useGetTransactions()
    const { filters } = useGetFilters()
    const [autoCatMap, setAutoCatMap] = useState<Map<string, ICategory | undefined>>(new Map())
    // const [categoryList, setCategoryList] = useState<string[]>([])


    const { categories } = useGetCategories()

    // const calcAutoCatMap = () => {
    //     if (!transactions) return new Map<string, ICategory | null>()
    //     const autoCatMap = calcAutoCatMapBulk(transactions)
    //     return autoCatMap
    // }

    useEffect(() => {
        setAutoCatMap(calcAutoCatMap(transactions, filters))
    }, [filters])

    if (!transactions) return <div>Loading...</div>

    transactions.forEach(transaction => {
        transaction._category = transaction._category || autoCatMap.get(transaction.hash)
    })


    if (transactions.length > 0) {
        return (
            <>
                {/*  <div className="flex flex-col h-full"> */}
                <h1 className='text-3xl font-bold py-6 px-4'>מיון פעולות</h1>
                {/* <div className='flex-1 overflow-y-auto' > */}
                <FilterDialog refreshAutoCatMap={() => { }}>
                    <Button variant="outline">קטגוריה אוטומטית</Button>
                </FilterDialog>
                <TransactionsTable
                    columns={columns}
                    autoCatMap={autoCatMap}
                    transactions={transactions.sort((a, b) => ((b._calibratedDate as any) - (a._calibratedDate as any))).filter(row => !row._isApproved)}
                    // setData={setTransactions}
                    categories={categories}
                />
            </>
        )

    }


    return <div>Loading...</div>
}

export default Inbox