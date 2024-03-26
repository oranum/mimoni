import { getTransactions, updateTransaction } from "@/lib/actions/transactions.actions";
import { ITransaction } from "@/lib/database/models/transaction.model";
import { NextResponse } from "next/server";

export async function GET() {
    const transactions = await getTransactions();
    return NextResponse.json(transactions);
}



export async function updateTransactionApi(transaction: ITransaction) {


    const updatedTransaction = await updateTransaction(transaction);
    // return NextResponse.json(updatedTransaction);
}

