"use client"

import { ITransaction } from "@/lib/database/models/transaction.model"
import { ColumnDef, Row, RowModel } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const columns: ColumnDef<ITransaction>[] = [
    {
        accessorKey: "date",
        header: "Original Date",
        cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString("he-IL"),


    },
    {
        accessorKey: "originalAmount",
        header: "Original Amount",
        cell: ({ row }) => -1 * Number(row.getValue("originalAmount")),
    },
    {
        accessorKey: "originalCurrency",
        header: "Original Currency",
    },
    {
        accessorKey: "chargedAmount",
        header: "Charged Amount",
    },
    {
        accessorKey: "description",
        header: "Description",
    },

    {
        accessorKey: "accountNumber",
        header: "Account Number",
    },
    {
        accessorKey: "category",
        header: "Category",
    },
    {
        accessorKey: "_createdAt",
        header: "Created At",
    },
    {
        accessorKey: "_lastUpdated",
        header: "Last Updated",
    },
];
