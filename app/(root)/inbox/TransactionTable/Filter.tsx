import { Input } from '@/components/ui/input';
import React from 'react';

type ColumnFilter = {
    id: string;
    value: unknown;
};

type ColumnFiltersState = ColumnFilter[];

type FilterProps = {
    columnFilters: ColumnFiltersState;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    columnId: string;
};

const Filter = ({ columnFilters, setColumnFilters, columnId }: FilterProps) => {
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value || '';

        setColumnFilters((prev) => {
            const newFilters = prev.filter((filter) => filter.id !== columnId);
            return [...newFilters, { id: columnId, value }];
        });
    };

    const value = columnFilters.find((f) => f.id === columnId)?.value || '';

    return (
        <Input
            type="search"
            value={(value as string) || ''}
            onChange={onChangeHandler}
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
    );
};

export default Filter;
