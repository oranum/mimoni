"use client"

import { ITransaction } from "@/lib/database/models/transaction.model"
import { ColumnDef, Row, RowModel } from "@tanstack/react-table"
import { CategorySelector } from "./table-components/categorySelector"
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { table } from "console";


export const columns: ColumnDef<ITransaction>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "hash",
        accessorKey: 'hash',
        header: 'Hash',
        //make it invisivble

    },

    {
        id: "date",
        accessorKey: "date",
        header: "Original Date",
        cell: ({ row }) => new Date(row.getValue("date")).toLocaleDateString("he-IL"),


    },
    {
        id: "originalAmount",
        accessorKey: "originalAmount",
        header: "Original Amount",
        cell: ({ row }) => -1 * Number(row.getValue("originalAmount")),
    },
    {
        id: "originalCurrency",
        accessorKey: "originalCurrency",
        header: "Original Currency",
    },
    {
        id: "chargedAmount",
        accessorKey: "chargedAmount",
        header: "Charged Amount",
    },
    {
        id: "description",
        accessorKey: "description",
        header: "Description",
    },

    {
        id: "accountNumber",
        accessorKey: "accountNumber",
        header: "Account Number",
    },
    {
        id: "_category",
        accessorKey: "_category.name",
        header: "Category",
        cell: ({ row }) => <CategorySelector />,
    },
    {
        id: "_createdAt",
        accessorKey: "_createdAt",
        header: "Created At",
    },
    {
        id: "_lastUpdated",
        accessorKey: "_lastUpdated",
        header: "Last Updated",
    },
    {
        id: "_isApproved",
        accessorKey: "_isApproved",
        header: "Approve",
        // cell: ({ getValue, row: { index }, column: { id }, table }) => {
        cell: ({ row, table, column }) => {
            // const initialValue = getValue()
            // const [isApproved, setIsApproved] = useState(initialValue)
            // useEffect(() => {
            //     setIsApproved(initialValue)
            // }, [initialValue])
            return (
                <Button onClick={() => {
                    const hash = row.getValue("hash") as string
                    const targetColumn = column.id
                    console.log("hash: ", hash, "targetColumn: ", targetColumn, "value to set: ", "true")
                    table.options.meta?.updateData(hash, targetColumn, true)
                }}>אשר</Button >
            )
        },
    }
];
