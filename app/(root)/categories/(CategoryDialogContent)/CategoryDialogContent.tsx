import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ICategory } from '@/lib/database/models/category.model'
import { Dialog } from '@radix-ui/react-dialog'
import React from 'react'

type CategoryDialogProps = {
    category: ICategory
}


const CategoryDialogContent = ({ category }: CategoryDialogProps) => {
    return (

        <DialogContent className="max-w-[800px]">
            <DialogHeader>
                <DialogTitle className='flex flex-row justify-start px-20'>{category.name}</DialogTitle>
                <DialogDescription className='flex flex-row justify-start px-20'>
                    הגדרת קטוגריה
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                        Name
                    </Label>
                    <Input id="name" value="Pedro Duarte" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                        Username
                    </Label>
                    <Input id="username" value="@peduarte" className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit">Save changes</Button>
            </DialogFooter>
        </DialogContent>

    )
}

export default CategoryDialogContent