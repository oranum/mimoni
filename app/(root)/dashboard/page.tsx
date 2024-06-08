'use client'

import { CoinsIcon, DollarSign, } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import DataCard from "./Card/DataCard"
import MonthlyChart, { ChartData } from "./MonthlyChart"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react"
import { getTransactions } from "@/lib/actions/transactions.actions"
import { ITransaction } from "@/lib/database/models/transaction.model"
import { set } from "mongoose"
import MonthSelector from "@/components/shared/MonthSelector"
import { useGetTransactions, useSetTransaction } from "@/lib/query-hooks/Transactions"


const processDataForChart = (transactions: ITransaction[]): ChartData[] => {
    const chartDataMap: Map<string, ChartData> = new Map();
    transactions.forEach(transaction => {
        const date = new Date(transaction._calibratedDate);

        const currentDate = new Date();
        const isWithinPast12Months = (currentDate.getFullYear() - date.getFullYear()) * 12 + currentDate.getMonth() - date.getMonth() <= 12;
        isWithinPast12Months

        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

        if (!chartDataMap.has(monthYear)) {
            chartDataMap.set(monthYear, {
                month: monthYear,
                sumIncome: 0,
                sumExpenses: 0,
                balance: 0
            });
        }
        const chartData = chartDataMap.get(monthYear)!;
        if (transaction.originalAmount >= 0) {
            chartData.sumIncome += transaction.originalAmount;
            // totalIncome += transaction.originalAmount;
        } else {
            chartData.sumExpenses += -1 * transaction.originalAmount;
            // totalExpenses += transaction.originalAmount;
        }
        chartData.balance += transaction.originalAmount;
        chartDataMap.set(monthYear, chartData);
    });
    return Array.from(chartDataMap.values(), (data) => ({
        ...data,
        sumIncome: Math.round(data.sumIncome),
        sumExpenses: Math.round(data.sumExpenses),
        balance: Math.round(data.balance),
    }));
};

const Dashboard = () => {
    const [showBalance, setShowBalance] = useState(false)

    const { transactions } = useGetTransactions()
    const { mutate: setTransactions } = useSetTransaction()
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)

    // const [chartData, setChartData] = useState<ChartData[]>([])
    const getRangeTransactions = () => {
        function getMonthsDifference(date: Date) {
            const today = new Date();
            const givenDate = new Date(date);
            const yearsDifference = today.getFullYear() - givenDate.getFullYear();
            const monthsDifference = today.getMonth() - givenDate.getMonth();
            const totalMonthsDifference = yearsDifference * 12 + monthsDifference;
            return totalMonthsDifference;
        }
        const monthsDifference = Math.min(getMonthsDifference(selectedMonth), 5)
        const startMonth = new Date(selectedMonth)
        startMonth.setMonth(selectedMonth.getMonth() - (6 + monthsDifference))
        const endMonth = new Date(selectedMonth)
        endMonth.setMonth(selectedMonth.getMonth() + (5 - monthsDifference))
        const filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction._calibratedDate);
            return transactionDate >= startMonth && transactionDate <= endMonth;
        });

        return filteredTransactions;
    }
    const rangeTransactions = getRangeTransactions()

    useEffect(() => {
        const fetchData = async () => {
            const data = await getTransactions(12, true, true)
            setTransactions(data)
        }
        fetchData()
    }, [])

    const totalIncome = transactions.reduce((total, transaction) => {
        return transaction.originalAmount >= 0 ? total + transaction.originalAmount : total;
    }, 0);
    const totalExpenses = transactions.reduce((total, transaction) => {
        return transaction.originalAmount < 0 ? total + transaction.originalAmount : total;
    }, 0);

    const incomeAverage = (totalIncome / 12);
    const expensesAverage = (totalExpenses / 12 * -1);


    const chartData = processDataForChart(rangeTransactions)


    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 ">
            <MonthSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <DataCard title="הכנסה חודשית ממוצעת" amount={incomeAverage} info="איזה יופי" Icon={CoinsIcon} />
                <DataCard title="הוצאה חודשית ממוצעת" amount={expensesAverage} info="איזה יופי" Icon={DollarSign} />
                <DataCard title="יתרה חודשית ממוצעת" amount={incomeAverage - expensesAverage} info="איזה יופי" Icon={DollarSign} />
            </div>
            <div >
                <Card >
                    <CardHeader className="flex flex-row justify-between items-start">
                        <div className="grid gap-2">
                            <CardTitle>תזרים חודשי</CardTitle>
                            <CardDescription>
                                Recent transactions from your store.
                            </CardDescription>
                        </div>
                        <div dir="ltr" className="flex gap-4">
                            <Switch checked={showBalance} onCheckedChange={() => setShowBalance(!showBalance)} />
                            <p>הצג יתרת תזרים</p>
                        </div>

                    </CardHeader>
                    <CardContent className="flex h-[300px] ">
                        <MonthlyChart showBalance={showBalance} data={chartData} />
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}

export default Dashboard