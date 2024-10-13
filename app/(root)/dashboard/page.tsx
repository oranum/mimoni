'use client';

import { CheckCircle, CheckCircle2Icon, ChevronsDownIcon, ChevronsUpIcon, CoinsIcon, DollarSign } from 'lucide-react';
import { badgeVariants } from '@/components/ui/badge';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DataCard from '../../../components/shared/DataCard';
import YearlyBarChart, { ChartData } from './YearlyBarChart';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';
import { ITransaction } from '@/lib/database/models/transaction.model';
import MonthSelector from '@/components/shared/MonthSelector';
import { useGetTransactions, useSetTransaction } from '@/lib/query-hooks/Transactions';
import TableCard from '../../../components/shared/TableCard';
import processDataForChart from './BarChart/processData';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import MonthlyTableCard from './MonthlyTableCard';
import { Label } from '@/components/ui/label';
import { calcMonthsDifference, useCreateTransactionVairables } from './helperFunctions';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import NewTransactionForm from '@/components/shared/NewTransactionForm';

const Dashboard = () => {
    //approved or not
    //ignored or not
    //this month

    //i need this months transactnions, count the pending.
    // use the approved and not ignored
    //also for the yearly, i need all transactions that are approved and not ignored

    const [showBalance, setShowBalance] = useState(false);
    const { transactions } = useGetTransactions('all');
    const pendingTransactions = transactions.filter((transaction) => !transaction._isApproved);
    const approvedTransactions = transactions.filter((transaction) => transaction._isApproved);
    // const includedTransactions = approvedTransactions.filter((transaction) => transaction._type !== 'ignore');
    const { mutate: setTransactions } = useSetTransaction();
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

    const { monthlyRelevantTransactions, monthlyPendingAmount, rangeRelevantTransactions } = useCreateTransactionVairables(transactions, selectedMonth);
    const incomeTransactions = monthlyRelevantTransactions.filter((t) => t._type === 'income');

    const { totalExpenses, totalIncome } = monthlyRelevantTransactions.reduce(
        (totals, t) => {
            const amount = t._convertedILSAmount || 0;
            t._type === 'income' ? (totals.totalIncome += amount) : (totals.totalExpenses += amount);
            return totals;
        },
        { totalExpenses: 0, totalIncome: 0 }
    );

    const incomeAverage = totalIncome / 12;
    const expensesAverage = (totalExpenses / 12) * -1;

    const chartData = processDataForChart(rangeRelevantTransactions);

    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {/* ********* Monthly ********* */}
            <div className="col-span-4">
                <div className="flex flex-row justify-between items-center">
                    <MonthSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
                    {monthlyPendingAmount > 0 ? (
                        <Link href="/inbox" className={badgeVariants({ variant: 'destructive' })}>
                            <Label className="whitespace-nowrap"> {monthlyPendingAmount} פעולות למיון </Label>
                        </Link>
                    ) : (
                        <Badge variant="secondary" className="bg-green-100">
                            <div className="flex flex-row gap-2 items-center text-green-800">
                                <CheckCircle2Icon />
                                <Label className="whitespace-nowrap">חודש ממוין</Label>
                            </div>
                        </Badge>
                    )}
                </div>
            </div>
            <div className="col-span-4 grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                <DataCard title='סה"כ הכנסות' amount={totalIncome} info="" Icon={ChevronsUpIcon} />
                <DataCard title='סה"כ הוצאות' amount={totalExpenses} info="" Icon={ChevronsDownIcon} />
                <DataCard title="יתרה חודשית" amount={totalIncome + totalExpenses} info="" Icon={DollarSign} />
            </div>
            <div className="col-span-2">
                <TableCard tableTransactions={incomeTransactions} />
            </div>
            <div className="col-span-4">
                <MonthlyTableCard
                    title={'הוצאות חודשיות'}
                    transactions={monthlyRelevantTransactions.filter((t) => t._convertedILSAmount && t._convertedILSAmount < 0)}
                />
            </div>
            {/* ********* Yearly ********* */}

            <NewTransactionForm defaultTransaction={transactions[0]} />
            <div className="grid col-span-4 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <DataCard title="הכנסה חודשית ממוצעת" amount={incomeAverage} info="איזה יופי" Icon={CoinsIcon} />
                <DataCard title="הוצאה חודשית ממוצעת" amount={expensesAverage} info="איזה יופי" Icon={DollarSign} />
                <DataCard title="יתרה חודשית ממוצעת" amount={incomeAverage - expensesAverage} info="איזה יופי" Icon={DollarSign} />
            </div>
            <div className="col-span-4">
                <Card>
                    <CardHeader className="flex flex-row justify-between items-start">
                        <div className="grid gap-2">
                            <CardTitle>תזרים חודשי</CardTitle>
                            {/* <CardDescription>Recent transactions from your store.</CardDescription> */}
                        </div>
                        <div dir="ltr" className="flex gap-4">
                            <Switch checked={showBalance} onCheckedChange={() => setShowBalance(!showBalance)} />
                            <p>הצג יתרת תזרים</p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex h-[300px] ">
                        <YearlyBarChart showBalance={showBalance} data={chartData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
