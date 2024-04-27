import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import Dropdown from './Dropdown'
import FilterRow from './FilterRow'
import { PlusCircleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ICategoryFilter, IFilterRow } from '@/lib/database/models/categoryFilter.model'
import { setCategoryFilter } from '@/lib/actions/filters.actions'
import { getTransactions } from '@/lib/actions/transactions.actions'
import { ITransaction } from '@/lib/database/models/transaction.model'
import checkFilter from '@/lib/logic/checkFilter'


export interface IFilterRowId extends IFilterRow {
    rowId: string
}

export function randomID() {
    return Math.floor(Math.random() * 1000000).toString()
}

type FilterDialogContentProps = {
    defaultRows?: IFilterRow[]
    defaultCategory?: string
    pastTransactions: ITransaction[]
    categoryList: string[]
}


const _FilterDialogContent = ({ defaultRows, defaultCategory, pastTransactions, categoryList }: FilterDialogContentProps) => {




    const [filterRows, setFilterRows] = useState<IFilterRowId[]>([{ rowId: randomID(), field: 'כותרת', operator: '', valuePrimary: '' }])
    const [categoryName, setCategoryName] = useState<string>(defaultCategory || '')
    const [targetType, setTargetType] = useState<string>('פעולה')

    const newCategoryFilter: ICategoryFilter = {
        category: { name: categoryName, ignore: false },
        targetType,
        filters: filterRows
    }

    function setRowHandler(newRow: IFilterRowId) {
        setFilterRows(filterRows.map((oldRow, i) => {
            // return i === index ? newRow : oldRow
            return oldRow.rowId === newRow.rowId ? newRow : oldRow
        }))
    }
    function deleteRowHandler(idToDelete: string) {
        setFilterRows((prev) => prev.filter(row => row.rowId !== idToDelete))
    }
    function submitHandler() {
        setCategoryFilter(newCategoryFilter);
    }

    const filteredPastTransactions = pastTransactions.filter(transaction => {
        const result = checkFilter(newCategoryFilter, transaction)
        console.log(result)
        return result
    })
    // console.log(filteredPastTransactions.length)

    const targetTypeList = ['פעולה', 'הוצאה', 'הכנסה']


    return (
        <>
            <div className="flex flex-col px-10">
                <DialogHeader>
                    <DialogTitle className="flex justify-center">צור קטגוריה אוטומטית</DialogTitle>
                    {/* <DialogDescription>צור קטגוריה אוטומטית</DialogDescription> */}
                </DialogHeader>

                <div className="my-10"></div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className='text-left col-span-1'>הוסף את הקטגוריה</Label>
                    <Dropdown items={categoryList} selected={categoryName} setSelected={setCategoryName} />
                    <div className="flex items-center gap-2">
                        <Label>לכל</Label>
                        <Dropdown items={targetTypeList} selected={targetType} setSelected={setTargetType} width="w-fit" />
                    </div>
                </div>

                <div className="my-6"></div>

                <div className="grid gap-4">
                    {filterRows.map((row, index) => {
                        return (
                            <FilterRow
                                key={row.rowId}
                                row={row}
                                setRow={(newRow) => setRowHandler(newRow)}
                                deleteRow={(rowId) => deleteRowHandler(rowId)}
                                label={index === 0 ? "ש:" : "וגם"} />
                        )
                    })}
                </div>
                <div className="grid grid-cols-4 items-center gap-4 text-gray-500 mt-4">
                    <Label className='text-left col-span-1'>וגם</Label>
                    <div className='text-left col-span-3'>
                        <div className="flex flex-row justify-center items-center">
                            <div className="flex-grow border-t border-dashed border-gray-500"></div>
                            <div className="mx-2">
                                <Button variant="ghost" size="icon" onClick={() => setFilterRows(() => [...filterRows, { rowId: randomID(), field: 'תיאור', operator: '', valuePrimary: '' }])}>
                                    <PlusCircleIcon />
                                </Button>
                            </div>
                            <div className="flex-grow border-t border-dashed border-gray-500"></div>
                        </div>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <div className='flex flex-col justify-end w-full mt-10'>
                    <div className="border-t border-black my-4"></div>
                    <span className='text-center'>נמצאו {filteredPastTransactions.length} תנועות</span>
                    <div className="w-full flex flex-col justify-center text-center gap-4 overflow-scroll  bg-slate-500 rounded-lg">
                        <div className='w-full h-[200px] flex justify-center'>
                            <ul className='flex flex-col w-full p-4'>

                                {filteredPastTransactions.map((transaction) => {
                                    return (
                                        <li key={transaction._id} className='flex justify-between border-b border-gray-300 py-2'>
                                            <span>{transaction.description}</span>
                                            <span>{transaction.originalAmount}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className='w-full flex justify-end mt-[15px]'>
                        <DialogClose asChild>
                            <Button className='w-20' onClick={submitHandler}>שמור</Button>
                        </DialogClose >
                    </div>
                </div>
            </DialogFooter >
        </>
    )
}

export default _FilterDialogContent