import { ITransaction } from "@/lib/database/models/transaction.model";

export const transactions: ITransaction[] = [
    {
        type: "normal",
        identifier: 61412883,
        date: "2023-01-17T22:00:00.000Z",
        processedDate: "2023-02-01T22:00:00.000Z",
        originalAmount: -176.83,
        originalCurrency: "ILS",
        chargedAmount: -176.83,
        description: "סופר פארם נופי ים ת\"",
        memo: "",
        status: "completed",
        accountNumber: "0989",
        category: "",
        hash: "2023-01-17T22:00:00.000Z_-176.83_סופר פארם נופי ים ת\"__isracard_0989"
    },
    {
        type: "normal",
        date: "2023-01-17T22:00:00.000Z",
        processedDate: "2023-02-01T22:00:00.000Z",
        originalAmount: -173,
        originalCurrency: "ILS",
        chargedAmount: -173,
        description: "אל וסינו(השכן)",
        memo: "",
        category: "",
        identifier: "04557433018005975052979",
        status: "completed",
        accountNumber: "1914",
        hash: "2023-01-17T22:00:00.000Z_-173_אל וסינו(השכן)__max_1914"
    },
    {
        type: "normal",
        identifier: 63300732,
        date: "2023-01-18T22:00:00.000Z",
        processedDate: "2023-02-01T22:00:00.000Z",
        originalAmount: -20,
        originalCurrency: "ILS",
        chargedAmount: -20,
        description: "העברה ב BIT בנה\"פ",
        memo: "",
        status: "completed",
        accountNumber: "0989",
        category: "",
        hash: "2023-01-18T22:00:00.000Z_-20_העברה ב BIT בנה\"פ__isracard_0989"
    }]