import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import DataCard from './DataCard';
import { DollarSign } from 'lucide-react';
import { ITransaction } from '@/lib/database/models/transaction.model';
import { ScrollArea } from '../ui/scroll-area';

const TableCard = ({ tableTransactions }: { tableTransactions: ITransaction[] }) => {
    const total = tableTransactions.reduce((acc, transaction) => acc + transaction.originalAmount, 0);

    return (
        <Card>
            {/* <CardHeader>
                <CardTitle>הכנסות חודשיות</CardTitle>
                <CardDescription>הכנסות קבועות</CardDescription>
            </CardHeader> */}
            <CardContent className="flex justify-between items-center">
                <DataCard amount={total} Icon={DollarSign} title='סה"כ הכנסה' />
                {/* <Card> */}
                <div className="h-52">
                    <IncomeTable incomeTransactions={tableTransactions} />
                </div>
                {/* </Card> */}
            </CardContent>
        </Card>
    );
};

export default TableCard;

const IncomeTable = ({ incomeTransactions }: { incomeTransactions: ITransaction[] }) => {
    return (
        <Table>
            {/* <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]"></TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                </TableRow>
            </TableHeader> */}
            <TableBody>
                <ScrollArea type="auto" className="w-full h-52">
                    {incomeTransactions.map((transaction) => (
                        <TableRow key={transaction._id}>
                            <TableCell className="font-medium">₪ {Number(transaction._convertedILSAmount?.toFixed(2))}</TableCell>
                            <TableCell className="font-medium"> {transaction.description} </TableCell>
                        </TableRow>
                    ))}
                </ScrollArea>
            </TableBody>
        </Table>
    );
};
