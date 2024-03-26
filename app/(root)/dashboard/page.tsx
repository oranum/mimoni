'use client'

import { useEffect, useState, useTransition } from 'react'
import { columns } from './TransactionTable/columns'
import { TransactionsTable } from './TransactionTable/TransactionsTable'
import { getTransactions } from '@/lib/actions/transactions.actions'
import { ITransaction } from '@/lib/database/models/transaction.model'
import { connectToDatabase } from '@/lib/database'
import { Search } from 'lucide-react'

const Dashboard = () => {

    const [data, setData] = useState<ITransaction[]>([])

    useEffect(() => {
        fetch("http://localhost:3000/api")
            .then(response => response.json())
            .then(jsonRes => {
                setData(jsonRes)
            }).catch(err => console.log(err))
    }, [])

    if (data.length > 0) {
        return (
            <div className='flex flex-col'>
                <h1 className='text-3xl font-bold py-6 px-4'>מיון פעולות</h1>
                <TransactionsTable columns={columns} data={data.sort((a, b) => (b._calibratedDate - a._calibratedDate)).filter(row => !row._isApproved)} setData={setData} />
            </div>)

    }


    return <div>Loading...</div>
}

export default Dashboard