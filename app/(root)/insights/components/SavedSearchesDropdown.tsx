import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HeartIcon } from "lucide-react"

type SavedSearchesDropdownProps = {
    savedSearches: Array<{ title: string }>
}

export function SavedSearchesDropdown({ savedSearches }: SavedSearchesDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className='flex flex-row items-center justify-start'>
                    <HeartIcon className="h-4 w-4" />
                    <div className="flex items-center mr-1">חיפושים שמורים</div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                    {savedSearches.length === 0 ?
                        <DropdownMenuItem>אין חיפושים שמורים</DropdownMenuItem>
                        :
                        savedSearches.map((search) => {
                            return (
                                <DropdownMenuItem>
                                    {search.title}
                                </DropdownMenuItem>
                            )
                        })}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
