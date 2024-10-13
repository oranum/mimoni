import { TransactionDialog } from '@/components/shared/TransactionDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTitle, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ITransaction } from '@/lib/database/models/transaction.model';
import { set } from 'mongoose';
import React, { useState } from 'react';

type MonthlyTableCardProps = {
    transactions: ITransaction[];
    title?: string;
};

const MonthlyTableCard = ({ transactions, title }: MonthlyTableCardProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);
    return (
        <>
            <Card>
                {title && <CardTitle>{title}</CardTitle>}
                <CardContent className=" py-4">
                    <div className="rounded-md border">
                        <ScrollArea type="auto" className="h-[400px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="">Amdount</TableHead>
                                        <TableHead className="">name</TableHead>
                                        <TableHead className="">name</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactions.map(
                                        (transaction) =>
                                            transaction._convertedILSAmount && (
                                                <TableRow
                                                    key={transaction._id}
                                                    onClick={() => {
                                                        setSelectedTransaction(transaction);
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    <TableCell className="font-medium">₪ {Number(transaction._convertedILSAmount?.toFixed(2))}</TableCell>
                                                    <TableCell className="font-medium"> {transaction.description} </TableCell>
                                                    <TableCell className="font-medium"> {transaction.description} </TableCell>
                                                </TableRow>
                                            )
                                    )}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </div>
                </CardContent>
            </Card>
            {selectedTransaction && (
                <TransactionDialog
                    setIsOpen={setIsDialogOpen}
                    isOpen={isDialogOpen}
                    onClose={() => {
                        setSelectedTransaction(null);
                        setIsDialogOpen(false);
                        console.log("default close onclose initialized");
                    }}
                    onSave={() => {}}
                    transaction={selectedTransaction}
                />
            )}
        </>
    );
};

export default MonthlyTableCard;
