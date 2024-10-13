import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon, ChevronUpCircleIcon, ChevronUpIcon } from 'lucide-react'
import { useState } from 'react'

type DropdownProps = {
    items: string[],
    selected: string,
    setSelected: (item: string) => void,
    width?: 'fit-content' | string
}
const Dropdown = ({ items, selected, setSelected, width }: DropdownProps) => {

    items.includes(selected) || setSelected(items[0])
    const handleSelect = (e: Event) => {
        const target = e.target as HTMLDivElement;

        setSelected(target.innerText)
    }

    // const [selectedItem, setSelectedItem] = useState(selected)
    const [open, setOpen] = useState(false)

    return (
        <DropdownMenu open={open} onOpenChange={(open) => { setOpen(open) }} >
            <DropdownMenuTrigger asChild >
                <Button variant="outline" className={`py-1 px-0 grid grid-cols-4 justify-between ` + (width || 'w-[140px]')}>
                    <div className="col-span-3">
                        {selected}
                    </div>
                    <div className="col-span-1  py-0 justify-items-start">
                        {open ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={`overflow-y-auto max-h-[300px] ${width ? width : 'w-[140px]'}`} >
                <DropdownMenuGroup>
                    {items.map((item) => {
                        return (
                            <DropdownMenuItem onSelect={handleSelect} className='flex justify-center'>
                                {item}
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu >
    )
}

export default Dropdown