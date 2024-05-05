'use client'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCategoryList } from '@/lib/actions/categories.actions'
import { ICategory } from '@/lib/database/models/category.model'
import React, { useEffect, useState } from 'react'
import CategoryDialogContent from './(CategoryDialogContent)/CategoryDialogContent'

const CategoriesManager = () => {

    const [search, setSearch] = useState<string>('')
    const [categories, setCategories] = useState<ICategory[]>([])

    useEffect(() => {
        getCategoryList(false).then((categories) => {
            setCategories(categories as ICategory[])
        })
    }, [])



    const CategoryRow = ({ category }: { category: ICategory }) => {
        return (
            <div className='flex justify-between items-center hover:bg-gray-100'>
                <div>{category.name}</div>
                <Label>התעלם</Label>
                <Checkbox checked={category.ignore} />
            </div>
        )
    }

    const showDialog = () => {

    }

    return (
        <div className='container max-w-[600px]'>
            <Input value={search} onChange={((e) => setSearch(e.target.value))} placeholder='חפש קטגוריה' />
            <div className='flex flex-col'>
                {categories.map(category => {
                    return (

                        <Dialog>
                            <DialogTrigger>
                                <CategoryRow category={category} />
                            </DialogTrigger>
                            
                            <CategoryDialogContent category={category} />
                        </Dialog>
                    )
                })}

            </div>
        </div >

    )
}

export default CategoriesManager