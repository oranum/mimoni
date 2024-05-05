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

const Inbox = () => {

    const [transactions, setTransactions] = useState<ITransaction[]>([])
    const [autoCatMap, setAutoCatMap] = useState<Map<string, ICategory | null>>(new Map())
    const [categoryList, setCategoryList] = useState<string[]>([])

    useEffect(() => {
        fetch("http://localhost:3000/api")
            .then(response => response.json())
            .then(jsonRes => {
                setTransactions(jsonRes)
            }).catch(err => console.log(err))
    }, [])

    useEffect(() => {
        const fetch = async () => {
            const autoCatMap = await findAutoCategoryBulk(transactions)
            setAutoCatMap(autoCatMap)
        }
        fetch()
    }, [transactions])

    useEffect(() => {
        const fetch = async () => {
            const categoryList = await getCategoryList()
            setCategoryList(categoryList as string[])
        }
        fetch()
    }, [])


    if (transactions.length > 0) {
        return (
            <>

                {/*  <div className="flex flex-col h-full"> */}
                <h1 className='text-3xl font-bold py-6 px-4'>מיון פעולות</h1>
                {/* <div className='flex-1 overflow-y-auto' > */}
                <FilterDialog>
                    <Button variant="outline">קטגוריה אוטומטית</Button>
                </FilterDialog>
                <TransactionsTable
                    columns={columns}
                    autoCatMap={autoCatMap}
                    transactions={transactions.sort((a, b) => ((b._calibratedDate as any) - (a._calibratedDate as any))).filter(row => !row._isApproved)}
                    setData={setTransactions}
                    categoryList={categoryList}
                />
            </>
        )

    }


    return <div>Loading...</div>
}

export default Inbox