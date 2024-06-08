

import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import { ICategoryFilter, IFilterRow } from "@/lib/database/models/categoryFilter.model"
import { ITransaction } from "@/lib/database/models/transaction.model"
import { useEffect, useState } from "react"
import FilterRow from "./FilterRow"
import { PlayCircleIcon, PlusCircleIcon, icons } from "lucide-react"
import Dropdown from "./Dropdown"
import { getTransactions } from "@/lib/actions/transactions.actions"
import { setCategoryFilter } from "@/lib/actions/filters.actions"
import checkFilter from "@/lib/logic/checkFilter"
import { de } from "date-fns/locale"
import { useAddCategory, useGetCategories } from "@/lib/query-hooks/Categories"
import { useQuery } from "@tanstack/react-query"
import { useGetTransactions } from "@/lib/query-hooks/Transactions"
import { ICategory } from "@/lib/database/models/category.model"
import CategorySelector from "@/app/(root)/inbox/TransactionTable/table-components/categorySelector"
const MONTHS_TO_GET_EXAMPLE_TRANSACTIONS = 6

export interface IFilterRowId extends IFilterRow {
    rowId: string
}

export function randomID() {
    return Math.floor(Math.random() * 1000000).toString()
}

type FilterDialogProps = {
    defaultTransaction?: ITransaction,
    defaultFilter?: ICategoryFilter,
    children?: React.ReactNode,
    refreshAutoCatMap: () => void
}

const FilterDialog = ({ children, defaultFilter, refreshAutoCatMap }: FilterDialogProps) => {
    const [isOpen, setIsOpen] = useState(false)


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>

            <DialogTrigger>
                {children || <Button variant="outline">קטגוריה אוטומטית</Button>}
            </DialogTrigger>

            <DialogContent className="min-w-[850px] px-10 h-[90%] flex flex-col gap-10 justify-between">
                <FilterDialogContent defaultFilter={defaultFilter} refreshAutoCatMap={refreshAutoCatMap} /> {/*must be in a different component so it resets all of the states of the fields once the dialog is closed */}
            </DialogContent>
        </Dialog>
    )
}


type FilterDialogContentProps = {
    defaultFilter?: ICategoryFilter
    refreshAutoCatMap: () => void
}

const FilterDialogContent = ({ defaultFilter, refreshAutoCatMap }: FilterDialogContentProps) => {
    const { categories, isFetched: isCategoryFetched } = useGetCategories()
    const { mutate: addCategory } = useAddCategory()
    const categoryList = categories.map(c => c.name)
    const { transactions: pastTransactions } = useGetTransactions(MONTHS_TO_GET_EXAMPLE_TRANSACTIONS)

    const defaultRows = (defaultFilter?.filterRows?.map(row => ({ ...row, rowId: randomID() })) || [{ rowId: randomID(), field: 'כותרת', operator: '', valuePrimary: '' }]) as IFilterRowId[]
    const [filterRows, setFilterRows] = useState<IFilterRowId[]>(defaultRows)
    const [categoryName, setCategoryName] = useState<string>(defaultFilter?.category.name || '')
    const [selectedCategory, setSelectedCategory] = useState<ICategory | undefined>(defaultFilter?.category)
    const [targetType, setTargetType] = useState<string>('פעולה')


    const newCategoryFilter: ICategoryFilter = {
        category: { name: categoryName, ignore: false },
        targetType,
        filterRows: filterRows
    }

    function createAndAddFromString(string: string): ICategory {
        const newCategory: ICategory = { name: string, ignore: false }
        addCategory(newCategory)
        return newCategory
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
        refreshAutoCatMap()
    }

    const filteredPastTransactions = newCategoryFilter.filterRows.length ?
        pastTransactions?.filter(transaction => {
            const result = checkFilter(newCategoryFilter, transaction)
            return result
        }) : []
    console.log(categoryList)

    const targetTypeList = ['פעולה', 'הוצאה', 'הכנסה']

    const CategoryTitleRow = () => {



        return (
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className='text-left col-span-1'>הוסף את הקטגוריה</Label>

                {<CategorySelector
                    categories={categories}
                    addCategory={addCategory}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    placeholder={"בחר קטגוריה"}
                />
                }

                <div className="flex items-center gap-2">
                    <Label>לכל</Label>
                    <Dropdown items={targetTypeList} selected={targetType} setSelected={setTargetType} width="w-fit" />
                </div>
            </div>
        )
    }

    const AddItemRow = () => {
        return (
            <div className="grid grid-cols-4 items-center gap-4 text-gray-500 ">
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
        )
    }

    const Footer = () => {
        return (
            <DialogFooter className='h-[300px] flex-grow-0 flex-shrink-0'>
                <div className='flex flex-col flex-grow-0 flex-shrink-0 justify-end w-full '>
                    <div className="border-t border-black my-4" />
                    <span className='text-center'>נמצאו {filteredPastTransactions?.length || 0} תנועות</span>
                    <div className="w-full flex flex-col justify-center text-center gap-4 h-[200px] bg-slate-500 rounded-lg">
                        {/* <div className='w-full h-[200px] flex justify-center'> */}
                        <ul className=' w-full p-4 h-[200px] overflow-y-auto'>

                            {filteredPastTransactions?.map((transaction) => {
                                return (
                                    <li key={transaction._id} className='flex justify-between border-b border-gray-300 py-2'>
                                        <span>{transaction.description}</span>
                                        <span>{transaction.originalAmount}</span>
                                    </li>
                                )
                            })}
                        </ul>
                        {/* </div> */}
                    </div>

                    <div className='w-full flex justify-end mt-[15px]'>
                        <DialogClose asChild>
                            <Button className='w-20' onClick={submitHandler}>שמור</Button>
                        </DialogClose >
                    </div>
                </div>
            </DialogFooter >
        )
    }



    return (<>
        <div className='flex-grow-0 flex-shrink-0'>
            <DialogHeader>
                <DialogTitle className="flex justify-center">צור קטגוריה אוטומטית</DialogTitle>
            </DialogHeader>

            <div className="my-10" />

            <div className='flex flex-col gap-4 h-fit'>
                <CategoryTitleRow />

                {/* <div className="my-1" /> */}

                <div className="grid gap-4 max-h-52 h-fit">
                    {filterRows.map((row, index) => {
                        return (
                            <FilterRow
                                key={row.rowId}
                                row={row}
                                setRow={(newRow) => setRowHandler(newRow)}
                                deleteRow={(rowId) => deleteRowHandler(rowId)}
                                label={index === 0 ? "ש:" : "וגם"}
                                showTrash={filterRows.length > 1}
                            />
                        )
                    })}
                </div>
                {filterRows.length < 4 && <AddItemRow />}
            </div>
        </div>
        <Footer />
    </>
    )
}




export default FilterDialog