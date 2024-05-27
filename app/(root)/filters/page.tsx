'use client'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCategoryList } from '@/lib/actions/categories.actions'
import { ICategory } from '@/lib/database/models/category.model'
import React, { useEffect, useState } from 'react'
import FilterDialog from '@/components/shared/filterDialog/FilterDialog'
import { Button } from '@/components/ui/button'
import { getAllFilters } from '@/lib/actions/filters.actions'
import { ICategoryFilter } from '@/lib/database/models/categoryFilter.model'

const FiltersManager = () => {

    const [search, setSearch] = useState<string>('')
    const [filters, setFilters] = useState<ICategoryFilter[]>([])

    useEffect(() => {
        getAllFilters().then((filters) => {
            setFilters(filters)
        })
    }, [])



    const FilterRow = ({ filter }: { filter: ICategoryFilter }) => {
        return (
            <div className='flex justify-between items-center hover:bg-gray-100'>
                <div>{filter.category.name}</div>
                <Label>התעלם</Label>
                <Checkbox checked={filter.category.ignore} />
            </div>
        )
    }


    return (
        <div className='container max-w-[600px]'>
            <Input value={search} onChange={((e) => setSearch(e.target.value))} placeholder='חפש קטגוריה' />
            <div className='flex flex-col'>
                {filters.map(filter => {
                    return (
                        <FilterDialog defaultFilter={filter}>
                            <FilterRow filter={filter} />
                        </FilterDialog>
                    )
                })}
            </div>
        </div >

    )
}

export default FiltersManager
