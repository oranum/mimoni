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

const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
]



export function CategorySelector() {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [query, setQuery] = React.useState("")

    const onCreate = (query: string) => {
        setValue(query)
        setOpen(false)
        createCategoryAction({ name: query })

    }


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value || "Select framework..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput value={query} onValueChange={(query) => setQuery(query)} placeholder="Search framework..." className="h-9" />
                    {/* <CommandEmpty>No framework found.</CommandEmpty> */}
                    <CommandEmpty
                        onClick={() => {
                            onCreate(query);
                            setQuery('');
                        }
                        }
                        className='flex cursor-pointer items-center justify-center gap-1 italic'
                    >
                        <p>Create: </p>
                        <p className='block max-w-48 truncate font-semibold text-primary'>
                            {query}
                        </p>
                    </CommandEmpty>
                    <CommandGroup>

                        {frameworks.map((framework) => (
                            <CommandItem
                                key={framework.value}
                                value={framework.value}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                }}
                            >

                                {framework.label}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto h-4 w-4",
                                        value === framework.value ? "opacity-100" : "opacity-0"
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
