"use client"

import { ITransaction } from "@/lib/database/models/transaction.model"
import { ColumnDef, Row, RowModel } from "@tanstack/react-table"
import { CategorySelector } from "./table-components/categorySelector"
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { table } from "console";
import ComboboxWithAdd from "@/components/ui/combobox-with-add";
import { createCategoryAction } from "@/lib/actions/categories.actions";
import { ICategory } from "@/lib/database/models/category.model";
import { CalendarDays } from "lucide-react";


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

    },

    {
        id: "date",
        accessorKey: "date",
        header: "Original Date",
        cell: ({ row }) => {
            const displayDate = new Date((row.getValue("_calibratedDate") || row.getValue("date"))).toLocaleDateString("he-IL")
            return (
                <div className="flex gap-1">
                    {displayDate}
                    <Button variant='outline' size={"icon"} className='w-5 h-5' onClick={() => { }}>{<CalendarDays />}</Button>
                </div>
            )
        }
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
        accessorKey: "_category",
        header: "Category",
        cell: ({ row, column, table }) => {
            const autoCategory = table.options.meta?.autoCatMap.get(row.getValue("hash") as string)
            return (
                <ComboboxWithAdd
                    setValue={(selected) => {
                        console.log("selected", selected)
                        table.options.meta?.updateData(row, column.id, { name: selected })
                    }}
                    onAdd={async (newCategory) => await createCategoryAction({ name: newCategory, ignore: false })}
                    categoryName={(row.getValue("_category") as ICategory)?.name || autoCategory?.name || ""}
                    items={table.options.meta?.categoryList || []} />
            )
        }
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
        id: "_calibratedDate",
        accessorKey: "_calibratedDate",
        header: "Calibrated Date",

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
                    table.options.meta?.updateData(row, column.id, true)
                }}>אשר</Button >
            )
        },
    }
];
