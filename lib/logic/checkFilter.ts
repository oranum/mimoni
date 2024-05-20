import { ICategoryFilter, IFilterRow } from "../database/models/categoryFilter.model"
import { ITransaction } from "../database/models/transaction.model"


const checkFilter = (filter: ICategoryFilter, transaction: ITransaction) => {
    for (const filterRow of filter.filterRows) {
        if (!checkFilterLine(filterRow, transaction)) {
            return false
        }
    }
    return true
}


const checkFilterLine = ({ field, operator, valuePrimary, valueSecondary }: IFilterRow, transaction: ITransaction) => {
    if (!field || !operator || !valuePrimary) {
        return false
    }

    const fieldNameToKeyMap = new Map<string, keyof ITransaction>()
        .set('כותרת', 'description')
        .set('סכום', 'originalAmount')
        .set('קטגוריה', 'category')
        .set('תאריך', 'date')
        .set('יום החיוב', '_calibratedDate')
        // .set('סוג', '_')
        .set('תגיות', '_tags')
        .set('הערה', '_note')
        .set('מספר חשבון', 'accountNumber')



    function getFieldValue(fieldName: string) {
        if (fieldName && fieldNameToKeyMap.has(fieldName)) {
            const key = fieldNameToKeyMap.get(fieldName) as keyof ITransaction;
            return transaction[key];
        }
        return ''
    }

    // console.log(field, getFieldValue(field), operator, valuePrimary, valueSecondary)

    switch (operator) {
        case 'מכיל':
            return getFieldValue(field).includes(valuePrimary)
        case 'אינו מכיל':
            return !getFieldValue(field).includes(valuePrimary)
        case 'גדול מ':
            return getFieldValue(field) > parseInt(valuePrimary)
        case 'קטן מ':
            return getFieldValue(field) < parseInt(valuePrimary)
        case 'שווה ל':
            return getFieldValue(field) === valuePrimary
        case 'יום החיוב':
            if (field === '_calibratedDate' && valuePrimary && valueSecondary) {
                const day = new Date(getFieldValue(field)).getDate()
                return day >= Number(valuePrimary) && day <= Number(valueSecondary)
            }
        case 'לא בין':
            if (field === '_calibratedDate' && valuePrimary && valueSecondary) {
                const day = new Date(getFieldValue(field)).getDate()
                return !(day >= Number(valuePrimary) && day <= Number(valueSecondary))
            }
        default:
            return false
    }
}


export default checkFilter