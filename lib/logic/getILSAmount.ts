import { ITransaction } from '../database/models/transaction.model';

export default async function getILSAmount(transaction: ITransaction) {
    if (transaction.originalCurrency === 'ILS') {
        return transaction.chargedAmount;
    }
    if (transaction.originalCurrency === 'USD' || transaction.originalCurrency === 'דולר') {
        return transaction.chargedAmount * 3.2;
    }
    if (transaction.originalCurrency === 'EUR') {
        return transaction.chargedAmount * 3.8;
    }
    if (transaction.originalCurrency === 'GBP') {
        return transaction.chargedAmount * 4.3;
    }

    const apiKey = 'fca_live_c3oxi75Jf5wfcAGHvFeAIQ0PjDJnt81kIHpTrCRA';
    const baseUrl = 'https://api.freecurrencyapi.com/v1/historical';

    const date = new Date(transaction.date).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    console.log(date);

    const url = `${baseUrl}?apikey=${apiKey}&currencies=ILS&date_from=${date}&date_to=${date}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const responseJSON = await response.json();
        console.log(responseJSON);

        // Get the first key in the data object
        const firstKey = Object.keys(responseJSON.data)[0];
        const rate = responseJSON.data[firstKey].ILS;
        return rate * transaction.chargedAmount;
    } catch (error) {
        console.error('Error fetching currency data:', error);
        throw error;
    }
}
