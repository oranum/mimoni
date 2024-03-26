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


export interface IFilterRowId extends IFilterRow {
    rowId: string
}

export function randomID() {
    return Math.floor(Math.random() * 1000000).toString()
}

type FilterDialogContentProps = {
    defaultRows?: IFilterRow[]
    defaultCategory?: string
}

const _FilterDialogContent = ({ defaultRows, defaultCategory }: FilterDialogContentProps) => {




    const [filterRows, setFilterRows] = useState<IFilterRowId[]>([{ rowId: randomID(), field: 'כותרת', operator: '', valuePrimary: '' }])
    const [category, setCategory] = useState<string>(defaultCategory || '')
    const [targetType, setTargetType] = useState<string>('פעולה')

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
        const newCategoryFilter: ICategoryFilter = {
            category,
            targetType,
            filters: filterRows
        }

        setCategoryFilter(newCategoryFilter);

    }

    useEffect(() => {
    }, [filterRows])


    const targetTypeList = ['פעולה', 'הוצאה', 'הכנסה']
    const categoryList = ['קטגוריה 1', 'קטגוריה 2', 'קטגוריה 3', 'קטגוריה 4', 'קטגוריה 5']


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
                    <Dropdown items={categoryList} selected={category} setSelected={setCategory} />
                    <div className="flex items-center gap-2">
                        <Label>לכל</Label>
                        <Dropdown items={targetTypeList} selected={targetType} setSelected={setTargetType} width="w-fit" />
                    </div>
                </div>

                <div className="my-6"></div>

                <div className="grid gap-4">
                    {filterRows.map((row, index) => {
                        console.log(row)
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
                <DialogClose asChild>
                    <Button onClick={submitHandler}>שמור</Button>
                </DialogClose>
            </DialogFooter>
            {/* </form> */}
        </>
    )
}

export default _FilterDialogContent