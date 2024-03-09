'use client'

import React, { useEffect } from 'react'
import { columns } from './columns'
import { TransactionsTable } from './TransactionsTable'
// import { transactions } from './example'
import { useState } from 'react'
import { getTransactions } from '@/lib/actions/transactions.actions'
import { ITransaction } from '@/lib/database/models/transaction.model'


const Dashboard = () => {
    const [transactions, setTransactions] = useState<ITransaction[]>([])
    useEffect(() => {
        getTransactions().then((data) => {
            console.log(data)
        })
    }, [])




    return (
        <TransactionsTable columns={columns} data={transactions} />
    )
}

export default Dashboard