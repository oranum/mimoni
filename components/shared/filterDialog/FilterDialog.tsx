

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

type FilterDialogProps = {
    defaultTransaction?: ITransaction,
    defaultCategory?: string,
    children?: React.ReactNode,
}



const FilterDialog = ({ children, defaultCategory, defaultTransaction }: FilterDialogProps) => {

    const targetTypeList = ['פעולה', 'הוצאה', 'הכנסה']
    const categoryList = ['קטגוריה 1', 'קטגוריה 2', 'קטגוריה 3', 'קטגוריה 4', 'קטגוריה 5']
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
                <_FilterDialogContent />
                {/* defaultCategory={defaultCategory} defaultTransaction={defaultTransaction}  */}
            </DialogContent >
        </Dialog>
    )
}






export default FilterDialog