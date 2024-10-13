import { is } from 'date-fns/locale';
import { ITransaction } from '../database/models/transaction.model';
//@ts-ignore //it gives error because the library is not typed. I don't care about it.
import Freecurrencyapi from '@everapi/freecurrencyapi-js';
import getILSAmount from './getILSAmount';
const freecurrencyapi = new Freecurrencyapi('fca_live_c3oxi75Jf5wfcAGHvFeAIQ0PjDJnt81kIHpTrCRA');

export async function processNewTransaction(transaction: ITransaction): Promise<ITransaction> {
    const convertedILSAmount = transaction.originalCurrency === 'ILS' ? transaction.chargedAmount : await getILSAmount(transaction);

    console.log('originalAmount:', transaction.originalAmount, ' ', transaction.originalCurrency, 'convertedILSAmount:', convertedILSAmount);
    return {
        ...transaction,
        _createdAt: new Date(),
        _calibratedDate: new Date(transaction.date),
        _convertedILSAmount: convertedILSAmount,
        _isProcessed: true,
        _category: undefined,
        _lastUpdated: new Date(),
        _ignore: false,
        _isApproved: false,
    };
}
