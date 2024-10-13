'use client';

import { use, useEffect, useState, useTransition } from 'react';
import { columns } from './TransactionTable/columns';
import { TransactionsTable } from './TransactionTable/TransactionsTable';
import { ITransaction } from '@/lib/database/models/transaction.model';
import { ICategory } from '@/lib/database/models/category.model';
import { set } from 'mongoose';
import RuleDialog from '@/components/shared/filterDialog/FilterDialog';
import { Button } from '@/components/ui/button';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { WithId } from 'mongodb';
import { useGetTransactions, useTransactions } from '@/lib/query-hooks/Transactions';
import { useToast } from '@/components/ui/use-toast';
import { useGetCategories } from '@/lib/query-hooks/Categories';
import { useGetOverlayRules } from '@/lib/query-hooks/OverlayRules';
import { ICategoryFilter } from '@/lib/database/models/categoryFilter.model';
import checkRule from '@/lib/logic/checkOverlayRule';
import { IOverlayRule } from '@/lib/database/models/overlayRule.model';

const Inbox = () => {
    //TODO:
    //creagte a useeffect that tracks the change in the rules db, using usequery. useGetOverlayRules
    //Then, it will reonvoke the calculation of the ruels map

    const calcAutoCategory = (transaction: ITransaction, rulesArray?: IOverlayRule[]) => {
        rulesArray = rulesArray || useGetOverlayRules().rules;
        for (const rule of rulesArray) {
            const result = checkRule(rule, transaction);
            if (result) {
                return rule.overlay._category;
            }
        }
        return null;
    };

    const calcAutoCatMap = (transactions: ITransaction[], rules: IOverlayRule[]) => {
        let results = new Map<string, ICategory | undefined>();
        for (const transaction of transactions) {
            for (const rule of rules) {
                const result = checkRule(rule, transaction);
                if (result) {
                    results.set(transaction.hash, rule.overlay._category);
                    break;
                }
            }
        }
        return results;
    };

    const queryClient = useQueryClient();

    // const [transactions, setTransactions] = useState<ITransaction[]>([])

    const { transactions } = useGetTransactions();
    // const [transactions, setTransactions] = useTransactions();
    const { rules } = useGetOverlayRules();
    const [autoCatMap, setAutoCatMap] = useState<Map<string, ICategory | undefined>>(new Map());
    // const [categoryList, setCategoryList] = useState<string[]>([])

    const { categories } = useGetCategories();

    // const calcAutoCatMap = () => {
    //     if (!transactions) return new Map<string, ICategory | null>()
    //     const autoCatMap = calcAutoCatMapBulk(transactions)
    //     return autoCatMap
    // }

    // useEffect(() => {
    //     setAutoCatMap(calcAutoCatMap(transactions, filters))
    // }, [filters])

    if (!transactions) return <div>Loading...</div>;

    transactions.forEach((transaction) => {
        transaction._category = transaction._category || autoCatMap.get(transaction.hash);
    });

    const [data, setData] = useState<ITransaction[]>(
        transactions.sort((a, b) => (b._calibratedDate as any) - (a._calibratedDate as any)).filter((row) => !row._isApproved)
    );
    if (transactions.length > 0) {
        return (
            <>
                {/*  <div className="flex flex-col h-full"> */}
                <h1 className="text-3xl font-bold py-6 px-4">מיון פעולות</h1>
                {/* <div className='flex-1 overflow-y-auto' > */}
                <RuleDialog refreshOverlayMap={() => {}}>
                    <Button variant="outline">קטגוריה אוטומטית</Button>
                </RuleDialog>
                <TransactionsTable
                    columns={columns}
                    autoCatMap={autoCatMap}
                    transactions={transactions.sort((a, b) => (b._calibratedDate as any) - (a._calibratedDate as any)).filter((row) => !row._isApproved)}
                    setData={setData}
                    categories={categories}
                />
            </>
        );
    }

    return <div>Loading...</div>;
};

export default Inbox;
