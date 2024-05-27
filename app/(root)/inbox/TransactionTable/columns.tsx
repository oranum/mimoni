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
import { CalendarDays, Wand2Icon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { set } from "mongoose";
import { he } from 'date-fns/locale'
import { MagicWandIcon } from "@radix-ui/react-icons";


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
        cell: ({ row, table, column }) => {
            const [isCalOpen, setIsCalOpen] = useState(false)
            const [selectedDate, setSelectedDate] = useState<Date>(new Date(row.getValue("_calibratedDate") || row.getValue("date")))
            const displayDate = selectedDate.toLocaleDateString("he-IL")

            const handleSelectDate = (newDate?: Date) => {
                if (newDate) {
                    //if new date is string, convert it to date
                    if (typeof newDate === 'string') {
                        newDate = new Date(newDate)
                        console.log("new date is string", newDate)
                    }
                    console.log("selected date", newDate)
                    setSelectedDate(newDate)
                    table.options.meta?.updateData(row, '_calibratedDate', newDate)
                }
                setIsCalOpen(false)
            }

            return (
                <div className="flex gap-2 align-middle">
                    {displayDate}
                    <Popover open={isCalOpen} onOpenChange={setIsCalOpen}>
                        <PopoverTrigger asChild>
                            <Button variant='outline' size={"icon"} className='w-6 h-6' >{<CalendarDays />}</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <Calendar
                                mode="single"
                                defaultMonth={selectedDate}
                                selected={selectedDate}
                                onSelect={handleSelectDate}
                                locale={he}
                                className="rounded-md border shadow"
                                />
                        </PopoverContent>
                    </Popover>
                </div >
            )

        },
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

            let isAutoCategory: boolean
            let categoryName: string
            const rowDataCategory = (row.getValue("_category") as ICategory)?.name || ""
            if (rowDataCategory) { //we have a catehory from db
                isAutoCategory = row.original._isAutoCategory || false
                categoryName = rowDataCategory
            }
            else //we don't have a category from db
            {
                const calcAutoCategory = table.options.meta?.autoCatMap.get(row.getValue("hash") as string)
                isAutoCategory = !!calcAutoCategory
                categoryName = calcAutoCategory?.name || ""
            }
            //now we 


            // first we need to check whether the category is already set or not.

            //option 1: we have a category, in that case we need to check wether it is an auto category or not
            //option 2: we don't have a category, in that case we need to display a combobox with add

            // if it is set, we will display a small icon suggesting it is auto-categorized
            // if not, we need a button to create an automation

            return (
                <div className="grid grid-cols-7 gap-3 items-center ">
                    <div className="col-span-6">
                        <ComboboxWithAdd
                            setValue={(selected) => {
                                table.options.meta?.updateData(row, column.id, { name: selected })
                                table.options.meta?.updateData(row, "_isAutoCategory", false)
                            }}
                            onAdd={async (newCategory) => await createCategoryAction({ name: newCategory, ignore: false })}
                            categoryName={categoryName}
                            items={table.options.meta?.categoryList || []} />
                    </div>
                    <div className="col-span-1">
                        {isAutoCategory && <MagicWandIcon className="w-4 h-4 text-green-700" />}
                    </div>
                </div>
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
        // cell: ({getValue, row: {index}, column: {id}, table }) => {
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
                    console.log(row, column.id)
                }}>אשר</Button >
            )
        }
    },

];
