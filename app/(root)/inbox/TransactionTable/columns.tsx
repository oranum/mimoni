'use client';

import CategorySelector from '@/components/shared/CategorySelector';
import { ITransaction } from '@/lib/database/models/transaction.model';
import { ColumnDef, Row, RowModel } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ICategory } from '@/lib/database/models/category.model';
import { CalendarDays, Wand2Icon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useEffect, useState } from 'react';
import { he, tr } from 'date-fns/locale';
import { MagicWandIcon } from '@radix-ui/react-icons';
import { useAddCategory, useGetCategories } from '@/lib/query-hooks/Categories';
import { add } from 'date-fns';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ValueMap } from './TransactionsTable';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export const columns: ColumnDef<ITransaction>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'hash',
        accessorKey: 'hash',
        header: 'Hash',
    },
    {
        id: 'date',
        accessorKey: 'date',
        header: 'תאריך חיוב',
        cell: ({ row, table, column }) => {
            const [isCalOpen, setIsCalOpen] = useState(false);
            const [selectedDate, setSelectedDate] = useState<Date>(new Date(row.getValue('_calibratedDate') || row.getValue('date')));
            const displayDate = selectedDate.toLocaleDateString('he-IL');

            const handleSelectDate = (newDate?: Date) => {
                if (newDate) {
                    //if new date is string, convert it to date
                    if (typeof newDate === 'string') {
                        newDate = new Date(newDate);
                        console.log('new date is string', newDate);
                    }
                    console.log('selected date', newDate);
                    setSelectedDate(newDate);
                    table.options.meta?.updateTransactionRow(row, new Map([['_calibratedDate', newDate]]));
                }
                setIsCalOpen(false);
            };

            return (
                <div className="flex gap-2 align-middle">
                    {displayDate}
                    <Popover open={isCalOpen} onOpenChange={setIsCalOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size={'icon'} className="w-6 h-6">
                                {<CalendarDays />}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <Calendar
                                mode="single"
                                defaultMonth={selectedDate}
                                selected={selectedDate}
                                onSelect={handleSelectDate}
                                locale={he}
                                className="rounded-md border shadow"
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            );
        },
    },
    {
        id: '_convertedILSAmount',
        accessorKey: '_convertedILSAmount',
        header: 'סכום',
        cell: ({ row }) => {
            const chargedCurrency = row.getValue('originalCurrency') as string;
            const amount = Number(row.getValue('_convertedILSAmount') ?? 0);
            const formattedAmount = Math.abs(amount).toFixed(2);

            const amountClass = amount < 0 ? 'text-red-400 bg-red-50' : 'text-green-400 bg-green-50';

            return (
                <div>
                    <div className={`flex max-w-24 items-center justify-center p-3 rounded-full mx-2 ${amountClass}`}>
                        <span className="block font-bold text-base">{formattedAmount}</span>
                    </div>

                    {/* Conditionally show original amount and currency if it's not ILS */}
                    {chargedCurrency !== 'ILS' && (
                        <small className="text-gray-500">
                            {Math.abs(Number(row.getValue('chargedAmount')))} {chargedCurrency}
                        </small>
                    )}
                </div>
            );
        },
    },
    {
        id: 'originalCurrency',
        accessorKey: 'originalCurrency',
        header: 'מטבע',
    },
    {
        id: 'chargedAmount',
        accessorKey: 'chargedAmount',
        header: 'Charged Amount',
    },
    {
        id: 'description',
        accessorKey: 'description',
        header: 'כותרת',
        cell: ({ row, getValue }) => <Label>{getValue() as string}</Label>,
    },

    {
        id: 'accountNumber',
        accessorKey: 'accountNumber',
        header: 'חשבון',
        cell: ({ row, getValue }) => <Label>{getValue() as string}</Label>,
    },
    {
        id: '_category',
        accessorKey: '_category',
        header: 'קטגוריה',
        cell: ({ row, column, table }) => {
            const categories = table.options.meta?.categories || [];
            const { mutate: addCategory } = useAddCategory();
            let isAutoCategory: boolean;
            let categoryName: string;
            console.log(row.getValue('_category'));
            const rowDataCategory = row.getValue('_category') as ICategory;
            if (rowDataCategory) {
                //we have a catehory from db
                isAutoCategory = row.original._isAutoCategory || false;
            } //we don't have a category from db
            else {
                const calcAutoCategory = table.options.meta?.autoCatMap.get(row.getValue('hash') as string);
                isAutoCategory = !!calcAutoCategory;
                categoryName = calcAutoCategory?.name || '';
            }
            // first we need to check whether the category is already set or not.
            //option 1: we have a category, in that case we need to check wether it is an auto category or not
            //option 2: we don't have a category, in that case we need to display a combobox with add
            // if it is set, we will display a small icon suggesting it is auto-categorized
            // if not, we need a button to create an automation
            return (
                <div className="grid grid-cols-7 gap-3 items-center ">
                    <div className="col-span-6">
                        <CategorySelector
                            categories={categories}
                            addCategory={addCategory}
                            selectedCategory={rowDataCategory}
                            setSelectedCategory={(selectedCategory) => {
                                table.options.meta?.updateTransactionRow(
                                    row,
                                    new Map([
                                        ['_category' as keyof ITransaction, selectedCategory as ITransaction[keyof ITransaction]],
                                        ['_isAutoCategory' as keyof ITransaction, false],
                                    ])
                                );
                            }}
                        />
                    </div>
                    <div className="col-span-1">{isAutoCategory && <MagicWandIcon className="w-4 h-4 text-green-700" />}</div>
                </div>
            );
        },
    },
    {
        id: '_note',
        accessorKey: '_note',
        header: 'הערה',
        cell: ({ getValue, row, column: { id }, table }) => {
            const initialValue = row.getValue('_note') || '';
            // We need to keep and update the state of the cell normally
            const [value, setValue] = useState(initialValue);
            // When the input is blurred, we'll call our table meta's updateData function
            const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setValue(e.target.value);
                table.options.meta?.onChangeHandler(row.index, id, e.target.value);
            };

            const onBlur = () => {
                initialValue !== value && table.options.meta?.updateTransactionRow(row, new Map([['_note', value]]));
            };
            // If the initialValue is changed external, sync it up with our state
            useEffect(() => {
                setValue(initialValue);
            }, [initialValue]);
            return <Input className="justify-center items-center text-center" value={value as string} onChange={onChange} onBlur={onBlur} />;
        },
    },
    {
        id: '_createdAt',
        accessorKey: '_createdAt',
        header: 'Created At',
    },
    {
        id: '_lastUpdated',
        accessorKey: '_lastUpdated',
        header: 'Last Updated',
    },
    {
        id: '_calibratedDate',
        accessorKey: '_calibratedDate',
        header: 'Calibrated Date',
    },
    {
        id: '_type',
        accessorKey: '_type',
        header: 'תזרים',
        cell: ({ row, table }) => {
            return (
                <ToggleGroup
                    type="single"
                    onValueChange={(value) => table.options.meta?.updateTransactionRow(row, new Map([['_type', value]]))}
                    value={row.getValue('_type')}
                    variant="outline"
                >
                    <ToggleGroupItem className="bg-white hover:border-black  hover:bg-white" value="include">
                        כלול
                    </ToggleGroupItem>
                    <ToggleGroupItem className="bg-white hover:border-black  hover:bg-white" value="ignore">
                        התעלם
                    </ToggleGroupItem>
                    <ToggleGroupItem className="bg-white hover:border-black  hover:bg-white" value="fixed">
                        קבועות
                    </ToggleGroupItem>
                    <ToggleGroupItem className="bg-white hover:border-black  hover:bg-white" value="dynamic">
                        משתנות
                    </ToggleGroupItem>
                    <ToggleGroupItem className="bg-white hover:border-black  hover:bg-white" value="income">
                        הכנסה
                    </ToggleGroupItem>
                </ToggleGroup>
            );
        },
    },

    {
        id: '_isApproved',
        accessorKey: '_isApproved',
        header: 'אישור',
        // cell: ({getValue, row: {index}, column: {id}, table }) => {
        cell: ({ row, table, column }) => {
            // const initialValue = getValue()
            // const [isApproved, setIsApproved] = useState(initialValue)
            // useEffect(() => {
            //     setIsApproved(initialValue)
            // }, [initialValue])

            const isCategorySet = !!(row.getValue('_category') as ICategory);
            console.log(row.getValue('_note'));
            return (
                <Button
                    // disabled={!isCategorySet}
                    onClick={() => {
                        //get the current transaction row from the table data state
                        const transaction = row.original;
                        //turn the transaction into a map
                        const transactionMap = new Map(Object.entries(transaction));
                        transactionMap.set('_isApproved', true);
                        table.options.meta?.updateTransactionRow(row, new Map([['_isApproved', true]]));
                        //console.log(row, column.id);
                    }}
                >
                    אשר
                </Button>
            );
        },
    },
];
