import { ITransaction } from '@/lib/database/models/transaction.model';
import { Form, SubmitHandler, useForm } from 'react-hook-form';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useState } from 'react';

type NewTransactionFormProps = {
    defaultTransaction: ITransaction;
};

type FormFields = {
    date: Date;
    amount: number;
    note: string;
};

const formatDate = (date?: Date | string | null): string => {
    if (!date) return ''; // Handle undefined, null, or empty date
    const d = typeof date === 'string' ? new Date(date) : date; // Convert string to Date if necessary

    // Check if the date is valid
    if (isNaN(d.getTime())) return ''; // Return empty string for invalid dates

    const year = d.toLocaleString('en-IL', { year: 'numeric', timeZone: 'Asia/Jerusalem' });
    const month = d.toLocaleString('en-IL', { month: '2-digit', timeZone: 'Asia/Jerusalem' });
    const day = d.toLocaleString('en-IL', { day: '2-digit', timeZone: 'Asia/Jerusalem' });

    // Return formatted date as YYYY-MM-DD
    return `${year}-${month}-${day}`;
};

const NewTransactionForm = ({ defaultTransaction }: NewTransactionFormProps) => {
    const { register, handleSubmit } = useForm<FormFields>();

    console.log(formatDate(defaultTransaction?._calibratedDate));
    const onSubmit: SubmitHandler<FormFields> = (data) => {
        console.log(data);
    };

    const [disabledAmount, setDisabledAmount] = useState(defaultTransaction?._convertedILSAmount || 0);
    const [userAmount, setUserAmount] = useState(defaultTransaction?._convertedILSAmount || 0);
    return (
        <form className="w-fit" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row border w-min-[800px] justify-between">
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="amount">תאריך</Label>
                    <Input type="date" {...register('date')} placeholder="date" defaultValue={formatDate(defaultTransaction?._calibratedDate)} />
                </div>
                <div className="flex flex-col w-96 space-y-2">
                    <Label htmlFor="amount">סכום</Label>
                    <Input className="w-32" type="number" defaultValue={disabledAmount} {...register('amount')} />
                </div>
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="note">Note</Label>
                    <Input type="text" {...register('note')} />
                </div>
            </div>
            <div className="flex flex-row border  justify-center">
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="amount">תאריך</Label>
                    <Input type="date" {...register('date')} placeholder="date" defaultValue={formatDate(defaultTransaction?._calibratedDate)} />
                </div>
                <div className="flex flex-col w-96 space-y-2">
                    <Label htmlFor="amount">סכום</Label>
                    <Input className="w-32" type="number" {...register('amount')} />
                </div>
                <div className="flex flex-col space-y-2">
                    <Label htmlFor="note">Note</Label>
                    <Input type="text" {...register('note')} />
                </div>
            </div>
        </form>
    );
};

export default NewTransactionForm;
