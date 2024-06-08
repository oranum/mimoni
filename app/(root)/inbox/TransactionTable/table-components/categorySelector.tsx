import ComboboxWithAdd from "@/components/ui/combobox-with-add";
import { ICategory } from "@/lib/database/models/category.model";
import { useAddCategory, useGetCategories } from "@/lib/query-hooks/Categories";

import React, { useEffect, useState } from 'react'

type CategoryComboboxProps = {
    categories: ICategory[]
    addCategory: (c: ICategory) => void
    selectedCategory?: ICategory
    setSelectedCategory: (c: ICategory) => void
    placeholder?: string
}


const CategorySelector = ({ categories, addCategory, selectedCategory, setSelectedCategory, placeholder }: CategoryComboboxProps) => {


    const extractStringFn = (category: ICategory) => category.name
    const createAndAddFromString = (string: string): ICategory => {
        const newCategory: ICategory = { name: string, ignore: false }
        addCategory(newCategory)
        return newCategory
    }

    return (
        <ComboboxWithAdd<ICategory>
            selected={selectedCategory || undefined}
            setSelected={setSelectedCategory}
            items={categories}
            createAndAddFromString={createAndAddFromString}
            placeholder={"בחר קטגוריה"}
            extractStringFn={extractStringFn}
        />
    )
}

export default CategorySelector
