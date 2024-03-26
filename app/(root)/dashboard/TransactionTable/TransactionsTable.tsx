"use client"

import {
    Cell,
    ColumnDef,
    Row,
    RowData,
    Updater,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ITransaction } from "@/lib/database/models/transaction.model"
import { useEffect, useState } from "react"
import { set } from "mongoose"
import { updateTransactionApi } from "@/app/api/route"


declare module '@tanstack/table-core' {
    interface TableMeta<TData extends RowData> {
        updateData: (row: Row<TData>, columnId: string, value: unknown) => void
    }
}

const defaultColumn: Partial<ColumnDef<ITransaction>> = {
    cell: ({ getValue, row, column: { id }, table }) => {
        const initialValue = getValue()
        // We need to keep and update the state of the cell normally
        const [value, setValue] = useState(initialValue)
        // When the input is blurred, we'll call our table meta's updateData function
        const onBlur = () => {
            initialValue !== value && table.options.meta?.updateData(row, id, value)
        }
        // If the initialValue is changed external, sync it up with our state
        useEffect(() => {
            setValue(initialValue)
        }, [initialValue])
        return (
            <input
                value={value as string}
                onChange={e => setValue(e.target.value)}
                onBlur={onBlur}
            />
        )
    },
}
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<ITransaction, TValue>[]
    data: ITransaction[]
    setData: React.Dispatch<React.SetStateAction<ITransaction[]>>
}


export function TransactionsTable<TData, TValue>({
    columns,
    data,
    setData,
}: DataTableProps<TData, TValue>) {

    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,

        state: {
            rowSelection,
            columnVisibility: {
                "hash": false,
            }
        },
        meta: {
            updateData: (row, columnId, value) => {
                const rowHash = row.getValue('hash')
                console.log(rowHash, columnId, value)
                setData(oldArray => oldArray.map((row) => {
                    if (row.hash === rowHash) {

                        return {
                            ...row,
                            [columnId]: value,
                        }
                    }
                    return row
                }))
                const updatedRow: ITransaction | undefined = { ...row.original, [columnId]: value }
                updateTransactionApi(updatedRow)
            }
        },

    })



    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )

}