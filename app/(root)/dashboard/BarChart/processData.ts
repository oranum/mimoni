import { ITransaction } from "@/lib/database/models/transaction.model";
import { ChartData } from "../YearlyBarChart";

const processDataForChart = (transactions: ITransaction[]): ChartData[] => {
    const chartDataMap: Map<string, ChartData> = new Map();
    transactions.forEach((transaction) => {
        const date = new Date(transaction._calibratedDate);

        const currentDate = new Date();
        const isWithinPast12Months = (currentDate.getFullYear() - date.getFullYear()) * 12 + currentDate.getMonth() - date.getMonth() <= 12;
        isWithinPast12Months;

        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

        if (!chartDataMap.has(monthYear)) {
            chartDataMap.set(monthYear, {
                month: monthYear,
                sumIncome: 0,
                sumExpenses: 0,
                balance: 0,
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


export default processDataForChart;