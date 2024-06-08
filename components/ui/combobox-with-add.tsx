"use client"

import { useState, useEffect } from "react"
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



type ComboboxWithAddProps<T> = {
    selected: T | undefined
    items: NonNullable<T[]>
    setSelected: (value: T) => void
    createAndAddFromString: (string: string) => T
    placeholder?: string
    extractStringFn: (item: T) => string

}
export default function ComboboxWithAdd<T>({ selected, setSelected, items, createAndAddFromString, placeholder, extractStringFn }: ComboboxWithAddProps<T>) {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const selectedString = selected ? extractStringFn(selected) : ""
    useEffect(() => {
        console.log("loaded dialog")
        return () => {
            console.log("unloaded dialog")
        }
    }
        , [])


    return (
        <Popover open={open} onOpenChange={(set) => {
            console.log("chaged dialog open")
            setOpen(set)
        }}
        >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between text-black ${!selected && "text-cyan-700" && "border-red-200"}`}
                >
                    {selectedString || placeholder || ""}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput value={query} onValueChange={(query) => setQuery(query)} placeholder="חפש קטגוריה" className="h-9" />
                    <CommandGroup>
                        {items.map((item) => {
                            const itemString = extractStringFn(item)
                            return (
                                <CommandItem
                                    key={itemString}
                                    value={itemString}
                                    onSelect={
                                        () => {
                                            setSelected(item)
                                            setOpen(false)
                                        }}>

                                    {itemString}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            selected === item ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            )
                        })}

                        <CommandSeparator />
                        {query &&
                            (
                                <>
                                    <CommandItem onSelect={() => {
                                        const createdItem = createAndAddFromString(query)
                                        setSelected(createdItem)
                                        setQuery('')
                                        setOpen(false)
                                    }}
                                    >צור קטגוריה:  {query}</CommandItem>
                                </>
                            )
                        }
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover >
    )
}
