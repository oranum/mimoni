import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ICategoryFilter, IFilterRow } from '@/lib/database/models/categoryFilter.model';
import { ITransaction } from '@/lib/database/models/transaction.model';
import { useEffect, useState } from 'react';
import FilterRow from './FilterRow';
import { PlayCircleIcon, PlusCircleIcon, icons } from 'lucide-react';
import { getTransactions } from '@/lib/actions/transactions.actions';
import { setOverlayRule } from '@/lib/actions/filters.actions';
import checkRule from '@/lib/logic/checkOverlayRule';
import { useAddCategory, useGetCategories } from '@/lib/query-hooks/Categories';
import { useQuery } from '@tanstack/react-query';
import { useGetTransactions } from '@/lib/query-hooks/Transactions';
import { ICategory } from '@/lib/database/models/category.model';
import CategorySelector from '@/components/shared/CategorySelector';
import { IOverlayRule, IRuleRow } from '@/lib/database/models/overlayRule.model';
import { Input } from '@/components/ui/input';
import Tags from '@/components/shared/Tags';
const MONTHS_TO_GET_EXAMPLE_TRANSACTIONS = 6;

export interface IRuleRowId extends IRuleRow {
    rowId: string;
}

export function randomID() {
    return Math.floor(Math.random() * 1000000).toString();
}

type RuleDialogProps = {
    defaultTransaction?: ITransaction;
    defaultOverlayRule?: IOverlayRule;
    children?: React.ReactNode;
    refreshOverlayMap: () => void;
};

const RuleDialog = ({ children, defaultOverlayRule, refreshOverlayMap }: RuleDialogProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>{children || <Button variant="outline">צור חוק</Button>}</DialogTrigger>

            <DialogContent className="min-w-[850px] px-10 h-[90%] flex flex-col gap-10 justify-between">
                <RulesDialogContent defaultOverlayRule={defaultOverlayRule} refreshOverlayRulesMap={refreshOverlayMap} />{' '}
                {/*must be in a different component so it resets all of the states of the fields once the dialog is closed */}
            </DialogContent>
        </Dialog>
    );
};

type RuleDialogContentProps = {
    defaultOverlayRule?: IOverlayRule;
    refreshOverlayRulesMap: () => void;
};

const RulesDialogContent = ({ defaultOverlayRule, refreshOverlayRulesMap }: RuleDialogContentProps) => {
    const { categories, isFetched: isCategoryFetched } = useGetCategories();
    const { mutate: addCategory } = useAddCategory();
    const categoryList = categories.map((c) => c.name);

    const { transactions: pastTransactions } = useGetTransactions(undefined, MONTHS_TO_GET_EXAMPLE_TRANSACTIONS);

    const defaultRows = (defaultOverlayRule?.ruleRows?.map((row) => ({ ...row, rowId: randomID() })) || [
        { rowId: randomID(), field: 'כותרת', operator: '', valuePrimary: '' },
    ]) as IRuleRowId[];
    const [ruleRows, setRuleRows] = useState<IRuleRowId[]>(defaultRows);
    const [categoryName, setCategoryName] = useState<string>(defaultOverlayRule?.overlay._category?.name || '');
    const [selectedCategory, setSelectedCategory] = useState<ICategory | undefined>(defaultOverlayRule?.overlay._category || undefined);
    const [targetType, setTargetType] = useState<string>('פעולה');

    const newRule: IOverlayRule = {
        overlay: {
            _category: { name: categoryName, ignore: false },
        },
        targetType,
        ruleRows,
    };

    function createAndAddFromString(string: string): ICategory {
        const newCategory: ICategory = { name: string, ignore: false };
        addCategory(newCategory);
        return newCategory;
    }

    function setRowHandler(newRow: IRuleRowId) {
        setRuleRows(
            ruleRows.map((oldRow, i) => {
                // return i === index ? newRow : oldRow
                return oldRow.rowId === newRow.rowId ? newRow : oldRow;
            })
        );
    }
    function deleteRowHandler(idToDelete: string) {
        setRuleRows((prev) => prev.filter((row) => row.rowId !== idToDelete));
    }
    function submitHandler() {
        setOverlayRule(newRule);
        refreshOverlayRulesMap();
    }

    const filteredPastTransactions = newRule.ruleRows.length
        ? pastTransactions?.filter((transaction) => {
              const result = checkRule(newRule, transaction);
              return result;
          })
        : [];

    const targetTypeList = ['פעולה', 'הוצאה', 'הכנסה'];

    const SelectCategoryRow = () => {
        return (
            <div className="grid grid-cols-4 items-center gap-4">
                {/* <Label className="text-left col-span-1">הוסף את הקטגוריה</Label> */}
                <CategorySelector
                    categories={categories}
                    addCategory={addCategory}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    placeholder={'בחר קטגוריה'}
                />
                <Input placeholder="הערה" />

                {/* <div className="flex items-center gap-2">
                    <Label>לכל</Label>
                    <Dropdown items={targetTypeList} selected={targetType} setSelected={setTargetType} width="w-fit" />
                </div> */}
            </div>
        );
    };

    const AddItemRow = () => {
        return (
            <div className="grid grid-cols-4 items-center gap-4 text-gray-500 ">
                <Label className="text-left col-span-1">וגם</Label>
                <div className="text-left col-span-3">
                    <div className="flex flex-row justify-center items-center">
                        <div className="flex-grow border-t border-dashed border-gray-500"></div>
                        <div className="mx-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setRuleRows(() => [...ruleRows, { rowId: randomID(), field: 'תיאור', operator: '', valuePrimary: '' }])}
                            >
                                <PlusCircleIcon />
                            </Button>
                        </div>
                        <div className="flex-grow border-t border-dashed border-gray-500"></div>
                    </div>
                </div>
            </div>
        );
    };

    const Footer = () => {
        return (
            <DialogFooter className="h-[300px] flex-grow-0 flex-shrink-0">
                <div className="flex flex-col flex-grow-0 flex-shrink-0 justify-end w-full ">
                    <div className="border-t border-black my-4" />
                    <span className="text-center">נמצאו {filteredPastTransactions?.length || 0} תנועות</span>
                    <div className="w-full flex flex-col justify-center text-center gap-4 h-[200px] bg-slate-500 rounded-lg">
                        {/* <div className='w-full h-[200px] flex justify-center'> */}
                        <ul className=" w-full p-4 h-[200px] overflow-y-auto">
                            {filteredPastTransactions?.map((transaction) => {
                                return (
                                    <li key={transaction._id} className="flex justify-between border-b border-gray-300 py-2">
                                        <span>{transaction.description}</span>
                                        <span>{transaction.originalAmount}</span>
                                    </li>
                                );
                            })}
                        </ul>
                        {/* </div> */}
                    </div>

                    <div className="w-full flex justify-end mt-[15px]">
                        <DialogClose asChild>
                            <Button className="w-20" onClick={submitHandler}>
                                שמור
                            </Button>
                        </DialogClose>
                    </div>
                </div>
            </DialogFooter>
        );
    };

    return (
        <>
            <div className="flex-grow-0 flex-shrink-0">
                <DialogHeader>
                    <DialogTitle className="flex justify-center">צור קטגוריה אוטומטית</DialogTitle>
                </DialogHeader>

                <div className="my-10" />

                <div className="flex flex-col gap-4 h-fit">
                    <SelectCategoryRow />

                    {/* <div className="my-1" /> */}

                    <div className="grid gap-4 max-h-52 h-fit">
                        {ruleRows.map((row, index) => {
                            return (
                                <FilterRow
                                    key={row.rowId}
                                    row={row}
                                    setRow={(newRow) => setRowHandler(newRow)}
                                    deleteRow={(rowId) => deleteRowHandler(rowId)}
                                    label={index === 0 ? 'ש:' : 'וגם'}
                                    showTrash={ruleRows.length > 1}
                                />
                            );
                        })}
                    </div>
                    {ruleRows.length < 4 && <AddItemRow />}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default RuleDialog;
