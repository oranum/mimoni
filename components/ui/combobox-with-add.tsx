"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { createCategoryAction } from "@/lib/actions/categories.actions"



type ComboboxWithAddProps = {
    categoryName: string
    items: string[]
    setValue: (value: string) => void
    onAdd: (value: string) => void
    placeholder?: string

}

export default function ComboboxWithAdd({ categoryName, setValue, items, onAdd, placeholder }: ComboboxWithAddProps) {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    console.log(categoryName)
    const onCreate = (query: string) => {
        setValue(query)
        setOpen(false)
        createCategoryAction({ name: query, ignore: false })
    }


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-[200px] justify-between text-black ${!categoryName && "text-cyan-700"}`}
                >
                    {categoryName || placeholder || "בחר מהרשימה..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput value={query} onValueChange={(query) => setQuery(query)} placeholder="Search framework..." className="h-9" />

                    <CommandGroup>

                        {items.map((item) => (
                            <CommandItem
                                key={item}
                                value={item}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === categoryName ? "" : currentValue)
                                    setOpen(false)
                                }}
                            >

                                {item}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        categoryName === item ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </CommandItem>

                        ))}
                        <CommandSeparator />
                        {query && (
                            <CommandItem onSelect={() => {
                                onCreate(query)
                                setQuery('')
                            }}
                            >צור קטגוריה:  {query}</CommandItem>)}

                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
