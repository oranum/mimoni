import { use, useReducer, useState } from 'react';
import { ITransaction } from '@/lib/database/models/transaction.model';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { CheckSquare } from 'lucide-react';
import CheckmarkButton from './CheckmarkButton';
import NewTransactionForm from './NewTransactionForm';
import { is } from 'date-fns/locale';
import { set } from 'mongoose';
import useEditTransaction from '@/lib/custom-hooks/useEditTransaction';
import { useCreateChildTransaction, useSetTransaction } from '@/lib/query-hooks/Transactions';

interface TransactionDialogProps {
    transaction: ITransaction;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onClose: () => void;
    onSave: (updatedTransaction: ITransaction) => void;
}

export const TransactionDialog = ({ transaction, isOpen, setIsOpen, onSave }: TransactionDialogProps) => {
    const [editedTransaction, setEditedTransaction] = useEditTransaction(transaction);
    const { mutate: setTransaction } = useSetTransaction();
    const { mutate: createChildTransaction } = useCreateChildTransaction();

    const [isSplitMode, setIsSplitMode] = useState(false);

    const handleSplitMode = () => {
        setEditedTransaction('_isParent', !isSplitMode);
        setIsSplitMode(!isSplitMode);
    };

    const onClose = () => {
        setIsOpen(false);
    };

    // Handle input changes
    const handleInputChange = (key: keyof ITransaction, value: any) => {};

    // Save the edited transaction
    const handleSave = () => {
        if (isSplitMode) {
            //     createChildTransaction(child1);
            //      createChildTransaction(child2);
        } else if (transaction._isParent) {
            setEditedTransaction('_isParent', false);
        }

        setTransaction(editedTransaction);
        onSave(editedTransaction);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="min-w-[800px]">
                <DialogHeader className="flex flex-row justify-between px-6 items-center">
                    <DialogTitle>{transaction.description}</DialogTitle>
                    <CheckmarkButton isChecked={transaction._isApproved} text={'approved'} />
                    <Button onClick={() => setIsSplitMode(!isSplitMode)}>Split</Button>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <ToggleGroup
                            type="single"
                            value={editedTransaction._type}
                            onValueChange={(value) => setEditedTransaction('_type', value)}
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
                    </div>

                    {/* Calibrated Date */}
                    <Label>Calibrated Date</Label>
                    <Label>{new Date(transaction._calibratedDate).toLocaleDateString()}</Label>

                    {/* Description */}
                    <Label>Description</Label>

                    <Input value={editedTransaction.description} onChange={(e) => handleInputChange('description', e.target.value)} />

                    {/* Charged Amount */}
                    <Label>Charged Amount</Label>
                    <Input
                        type="number"
                        value={editedTransaction.chargedAmount}
                        onChange={(e) => handleInputChange('chargedAmount', parseFloat(e.target.value))}
                    />

                    {/* Note */}
                    <div className="mb-4">
                        <Label>Note</Label>

                        <Input value={editedTransaction._note || ''} onChange={(e) => handleInputChange('_note', e.target.value)} />
                    </div>

                    {/* Tags */}
                    <div className="mb-4">
                        <Label>Tags</Label>
                        <Input
                            value={editedTransaction._tags?.join(', ') || ''}
                            onChange={(e) =>
                                handleInputChange(
                                    '_tags',
                                    e.target.value.split(',').map((tag) => tag.trim())
                                )
                            }
                        />
                    </div>

                    {/* Approved Status */}
                    <div className=" col-span-2 mb-4">
                        <Label>Is Approved</Label>

                        <Checkbox checked={editedTransaction._isApproved} onCheckedChange={(checked) => handleInputChange('_isApproved', checked)} />
                    </div>

                    {isSplitMode && <div className="mb-4">{<NewTransactionForm defaultTransaction={transaction} />}</div>}
                </div>
                <DialogFooter className="gap-4">
                    <Button onClick={handleSave}>שמור</Button>
                    <Button variant="secondary" onClick={onClose}>
                        ביטול
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
