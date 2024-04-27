

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
import _FilterDialogContent from "./_FilterDialogContent"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ICategoryFilter, IFilterRow } from "@/lib/database/models/categoryFilter.model"
import { ITransaction } from "@/lib/database/models/transaction.model"
import { useEffect, useState } from "react"
import FilterRow from "./FilterRow"
import { PlayCircleIcon, PlusCircleIcon, icons } from "lucide-react"
import Dropdown from "./Dropdown"
import { getTransactions } from "@/lib/actions/transactions.actions"
import { getCategoryList } from "@/lib/actions/categories.actions"

type FilterDialogProps = {
    defaultTransaction?: ITransaction,
    defaultCategory?: string,
    children?: React.ReactNode,
}

const MONTHS_TO_GET_TRANSACTIONS = 6


const FilterDialog = ({ children, defaultCategory, defaultTransaction }: FilterDialogProps) => {


    const [pastTransactions, setPastTransactions] = useState<ITransaction[]>([])
    const [categoryList, setCategoryList] = useState<string[]>([])



    useEffect(() => {
        async function getPastTransactions() {
            const pastTransactions = await getTransactions(MONTHS_TO_GET_TRANSACTIONS)
            setPastTransactions(pastTransactions)
            console.log(pastTransactions)
        }
        getPastTransactions()
    }, [])

    useEffect(() => {
        async function fetch() {
            const categoryList = await getCategoryList()
            setCategoryList(categoryList)
        }
        fetch()
    }, [])


    const targetTypeList = ['פעולה', 'הוצאה', 'הכנסה']
    return (
        <Dialog>
            {children ?
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger> :

                <DialogTrigger asChild>
                    <Button variant="outline">קטגוריה אוטומטית</Button>
                </DialogTrigger>
            }
            <DialogContent className="min-w-[850px] min-h-[580px] flex flex-col justify-between">
                <_FilterDialogContent categoryList={categoryList} pastTransactions={pastTransactions} />
                {/* defaultCategory={defaultCategory} defaultTransaction={defaultTransaction}  */}
            </DialogContent >
        </Dialog>
    )
}






export default FilterDialog