'use client'

import { use, useEffect, useState, useTransition } from 'react'
import { columns } from './TransactionTable/columns'
import { TransactionsTable } from './TransactionTable/TransactionsTable'
import { getTransactions } from '@/lib/actions/transactions.actions'
import { ITransaction } from '@/lib/database/models/transaction.model'
import { connectToDatabase } from '@/lib/database'
import { Search } from 'lucide-react'
import { findAutoCategoryBulk, getCategoryList } from '@/lib/actions/categories.actions'
import { ICategory } from '@/lib/database/models/category.model'
import { set } from 'mongoose'
import FilterDialog from '@/components/shared/filterDialog/FilterDialog'
import { Button } from '@/components/ui/button'
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import { WithId } from 'mongodb'
import { useGetTransactions } from '@/lib/query-hooks/Transactions'
import { useToast } from '@/components/ui/use-toast'


const Inbox = () => {

    const queryClient = useQueryClient()


    // const [transactions, setTransactions] = useState<ITransaction[]>([])
    const [autoCatMap, setAutoCatMap] = useState<Map<string, ICategory | null>>(new Map())
    const [categoryList, setCategoryList] = useState<string[]>([])





    const { transactions } = useGetTransactions()

    const categoryListQuery = useQuery({ queryKey: ['categoryList'], queryFn: () => getCategoryList() })

    if (!transactions) return <div>Loading...</div>
    console.log("approved transactions:", transactions.filter(transaction => transaction._isApproved))
    console.log("not approved transactions:", transactions.filter(transaction => !transaction._isApproved))
    // const autoCatMapQuery = useQuery({
    //     queryKey: ['autoCatMap'],
    //     queryFn: () => { },
    //     enabled: false //!!transactions
    // })

    async function fetchAutoCatMap() {
        if (!transactions) return
        // const autoCatMap = await findAutoCategoryBulk(transactions)
        // setAutoCatMap(autoCatMap)
    }

    // useEffect(() => {
    //     fetch("http://localhost:3000/api")
    //         .then(response => response.json())
    //         .then(jsonRes => {
    //             setTransactions(jsonRes)
    //         }).catch(err => console.log(err))
    // }, [])

    // useEffect(() => {
    // const fetch = async () => {
    //     const autoCatMap = await findAutoCategoryBulk(transactions)
    //     setAutoCatMap(autoCatMap)
    // }
    // fetchAutoCatMap()
    // }, [transactions])

    // useEffect(() => {
    //     const fetch = async () => {
    //         const categoryList = await getCategoryList()
    //         setCategoryList(categoryList as string[])
    //     }
    //     fetch()
    // }, [])


    if (transactions.length > 0) {
        return (
            <>

                {/*  <div className="flex flex-col h-full"> */}
                <h1 className='text-3xl font-bold py-6 px-4'>מיון פעולות</h1>
                {/* <div className='flex-1 overflow-y-auto' > */}
                <FilterDialog refreshAutoCatMap={fetchAutoCatMap}>
                    <Button variant="outline">קטגוריה אוטומטית</Button>
                </FilterDialog>
                <TransactionsTable
                    columns={columns}
                    autoCatMap={autoCatMap}
                    transactions={transactions.sort((a, b) => ((b._calibratedDate as any) - (a._calibratedDate as any))).filter(row => !row._isApproved)}
                    // setData={setTransactions}
                    categoryList={categoryList}
                />
            </>
        )

    }


    return <div>Loading...</div>
}

export default Inbox