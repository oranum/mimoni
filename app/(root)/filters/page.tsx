'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCategoryList } from '@/lib/actions/categories.actions';
import { ICategory } from '@/lib/database/models/category.model';
import React, { useEffect, useState } from 'react';
import RuleDialog from '@/components/shared/filterDialog/FilterDialog';
import { Button } from '@/components/ui/button';
import { getAllOverlayRules } from '@/lib/actions/filters.actions';
import { ICategoryFilter } from '@/lib/database/models/categoryFilter.model';
import { useGetFilters } from '@/lib/query-hooks/Filters';

const FiltersManager = () => {
    const [search, setSearch] = useState<string>('');

    const { filters } = useGetFilters();

    const FilterRow = ({ filter }: { filter: ICategoryFilter }) => {
        return (
            <div className="flex justify-between items-center hover:bg-gray-100">
                <div>{filter.category.name}</div>
                <Label>התעלם</Label>
                <Checkbox checked={filter.category.ignore} />
            </div>
        );
    };

    return (
        <div className="container max-w-[600px]">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="חפש קטגוריה" />
            <div className="flex flexÍ-col">
                {filters
                    .filter((filter) => filter.category.name.includes(search))
                    .map((filter) => {
                        return (
                            <RuleDialog key={filter._id} defaultFilter={filter} refreshAutoCatMap={() => {}}>
                                <FilterRow filter={filter} />
                            </RuleDialog>
                        );
                    })}
            </div>
        </div>
    );
};

export default FiltersManager;
