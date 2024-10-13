'use client';

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
    // getPaginationRowModel,
    getFilteredRowModel,
} from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ITransaction } from '@/lib/database/models/transaction.model';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ICategory } from '@/lib/database/models/category.model';
import { useSetTransaction } from '@/lib/query-hooks/Transactions';
import { useToast } from '@/components/ui/use-toast';
import { useGetCategories } from '@/lib/query-hooks/Categories';
import Filter from './Filter';

export type ValueMap = Map<keyof ITransaction, ITransaction[keyof ITransaction]>;
declare module '@tanstack/table-core' {
    interface TableMeta<TData extends RowData> {
        updateTransactionRow: (row: Row<TData>, valueMap: ValueMap) => void;
        onChangeHandler: (rowIndex: number, columnId: string, value: unknown) => void;
        autoCatMap: Map<string, ICategory | undefined>;
        categories: ICategory[];
    }
}

const defaultColumn: Partial<ColumnDef<ITransaction>> = {
    cell: ({ getValue, row, column: { id }, table }) => {
        const initialValue = getValue() || '';
        // We need to keep and update the state of the cell normally
        const [value, setValue] = useState(initialValue);
        // When the input is blurred, we'll call our table meta's updateData function
        const onBlur = () => {
            initialValue !== value && table.options.meta?.updateTransactionRow(row, new Map([[id as keyof ITransaction, value]]));
        };
        // If the initialValue is changed external, sync it up with our state
        useEffect(() => {
            setValue(initialValue);
        }, [initialValue]);
        return <Input className="justify-center items-center text-center" value={value as string} onChange={(e) => setValue(e.target.value)} onBlur={onBlur} />;
    },
};
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<ITransaction, TValue>[];
    transactions: ITransaction[];
    autoCatMap: Map<string, ICategory | undefined>;
    // setData: React.Dispatch<React.SetStateAction<ITransaction[]>>
    categories: ICategory[];
    setData: React.Dispatch<React.SetStateAction<ITransaction[]>>;
}

export function TransactionsTable<TData, TValue>({ columns, transactions, autoCatMap, categories, setData }: DataTableProps<TData, TValue>) {
    const { toast } = useToast();
    const [rowSelection, setRowSelection] = useState({});
    type ColumnFilter = {
        id: string;
        value: unknown;
    };
    type ColumnFiltersState = ColumnFilter[];
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const { mutate: optimisticSetTransaction, isError } = useSetTransaction();
    const table = useReactTable({
        data: transactions,
        columns,
        defaultColumn,
        getCoreRowModel: getCoreRowModel(),
        onRowSelectionChange: setRowSelection,
        getFilteredRowModel: getFilteredRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        columnResizeDirection: 'rtl',

        state: {
            rowSelection,
            columnFilters,
            columnVisibility: {
                hash: false,
                _createdAt: false,
                _lastUpdated: false,
                _calibratedDate: false,
                chargedAmount: false,
                originalCurrency: false,
                _category: false,
            },
        },
        meta: {
            //     updateData: (row, columnId, value) => {
            //         if (row.getValue('hash') === undefined) {
            //             console.log(row)
            //         }
            //         const rowHash = row.getValue('hash') as string
            //         setData(oldArray => oldArray.map((row) => {
            //             if (row.hash === rowHash) {

            //                 return {
            //                     ...row,
            //                     [columnId]: value,
            //                 }
            //             }
            //             return row
            //         }))
            //         // const updatedRow: ITransaction | undefined = { ...row.original, [columnId]: value }
            //         // console.log(updatedRow._calibratedDate)
            //         // updateTransaction(updatedRow)
            //         updateTransactionField(value, rowHash, columnId)
            //     },
            onChangeHandler: (rowIndex, columnId, value) => {
                setData((old) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            return {
                                ...old[rowIndex]!,
                                [columnId]: value,
                            };
                        }
                        return row;
                    })
                );
            },
            // onChangeHandler: (row: Row<ITransaction>, columnId: String, value: unknown) => {
            //     // const rowId =
            //     if (row.getValue('hash') === undefined) {
            //         console.log(row);
            //     }
            //     setData((oldData) =>
            //         oldData.map((oldRow) => {
            //             if (oldRow.hash === row.getValue('hash')) {
            //                 return {
            //                     ...oldRow,
            //                     [columnId]: value,
            //                 };
            //             }
            //             return row;
            //         })
            //     );
            // },
            
            
            
            updateTransactionRow: (row, valuesMap) => {
                if (row.getValue('hash') === undefined) {
                    console.log(row);
                }

                const updatedTransaction: ITransaction = { ...row.original };
                valuesMap &&
                    valuesMap.forEach((value: ITransaction[keyof ITransaction], columnId: keyof ITransaction) => {
                        //@ts-ignore - typescript cant infer that columnId is a key of ITransaction
                        updatedTransaction[columnId] = value;
                    });
                console.log(updatedTransaction);
                optimisticSetTransaction(updatedTransaction);
            },
            // updateTransactionRow: (newTransactionRow: Row<ITransaction>) => {
            //     if (newTransactionRow.getValue('hash') === undefined) {
            //         console.log(newTransactionRow)
            //     }
            //     const updatedRow: ITransaction = { ...newTransactionRow.original, }
            //     optimisticSetTransactions(newTransactionRow.original,)
            // }
            autoCatMap,
            categories: (() => {
                const { categories } = useGetCategories();
                console.log(categories);
                return categories;
            })(),
        },
    });

    return (
        <>
            <div className="rounded-md border">
                <Filter columnFilters={columnFilters} setColumnFilters={setColumnFilters} columnId="description" />
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-center">
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-center">
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
            {/* *********pagination buttons *************** */}
            {/* <div className="flex items-center justify-end space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Next
                </Button>
            </div> */}
        </>
    );
}
