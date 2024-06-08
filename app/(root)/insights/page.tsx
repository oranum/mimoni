'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HeartIcon } from 'lucide-react'
import { useState } from 'react'
import { SavedSearchesDropdown } from './components/SavedSearchesDropdown'
import Dropdown from '@/components/shared/filterDialog/Dropdown'
import FilterRow from '@/components/shared/filterDialog/FilterRow'
import { TransactionsTable } from '../inbox/TransactionTable/TransactionsTable'



const Insights = () => {

    const [searchValue, setSearchValue] = useState('')
    return (
        <>
            <h1 className='text-2xl font-bold'>התובנות שלי</h1>
            <div className='flex'>
                <Input
                    type="text"
                    placeholder="הוסף חיפוש"
                    className="pl-10 pr-3 py-2 text-md w-full max-w-sm border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E23DD] focus:border-transparent" // Add additional styling as needed
                    value={searchValue}
                />
                {/* <SavedSearchesDropdown savedSearches={
                    [{ title: "תקשורת" }]
                } />
                <
                 */}

            </div >

        </>
    )
}

export default Insights