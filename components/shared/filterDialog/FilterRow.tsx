'use client'
import { useEffect, useReducer } from 'react'
import Dropdown from './Dropdown'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2Icon } from 'lucide-react'
import { IFilterRowId, randomID } from './_FilterDialogContent'

type FilterRowProps = {
    label: string,
    // onChange: (field: string, operator: string, value: string) => void
    row: IFilterRowId,
    setRow: (newRow: IFilterRowId) => void
    deleteRow: (rowId: string) => void
}
interface Option {
    display: string;
    type: keyof Options2;
}
interface Options2 {
    [key: string]: string[]
}

interface Options3 {
    [key: string]: string[];
}
// const options1: Option[] = [
//     {
//         display: "כותרת",
//         type: "text"
//     },
//     {
//         display: "תיאור",
//         type: "text"
//     },
//     {
//         display: "יום החיוב",
//         type: "date"
//     },
//     {
//         display: "סכום",
//         type: "amount"
//     },
//     {
//         display: "קטגוריה",
//         type: "text"
//     },
//     {
//         display: "מספר חשבון",
//         type: "select"
//     },
//     {
//         display: "תגיות",
//         type: "text"
//     },
//     {
//         display: "הערה",
//         type: "text"
//     },
//     {
//         display: "סוג",
//         type: "select"
//     }

// ]
const options1 = new Map<string, keyof Options2>([
    ["כותרת", "text"],
    ["תיאור", "text"],
    ["יום החיוב", "date"],
    ["סכום", "amount"],
    ["קטגוריה", "text"],
    ["מספר חשבון", "account"],
    ["תגיות", "tags"],
    ["הערה", "note"],
    ["סוג", "select"]
])
const options2: Options2 = {
    text: ["מכיל", "אינו מכיל", "שווה ל"],
    date: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
    amount: ["גדול מ", "קטן מ", "בידיוק"],
    select: ["שווה ל", "שונה מ"],
    tags: ["כולל", "לא כולל"],
    note: ["מכיל", "אינו מכיל", "שווה ל"],
}





const FilterRow = ({ label, row, setRow, deleteRow }: FilterRowProps) => {
    function setSelected(payload: string, componentIndex: 1 | 2 | 3 | 4) {
        dispatch({ componentIndex, payload })
    }

    function reducer(state: IFilterRowId, action: { componentIndex: 1 | 2 | 3 | 4, payload: string }) {

        const newState = { ...state }
        switch (action.componentIndex) {
            case 1:
                newState.field = action.payload
                newState.operator = newState.field === 'יום החיוב' ? 'יום החיוב' : ''
                console.log(newState.operator)
                newState.valuePrimary = ''
                newState.valueSecondary = ''
                break
            case 2:
                newState.operator = action.payload
                break
            case 3:
                newState.valuePrimary = action.payload
                break
            case 4:
                newState.valueSecondary = action.payload
                break
            default:
                break
        }
        setRow(newState)
        return newState
    }

    const [state, dispatch] = useReducer(reducer, { ...row })



    function renderComponent() {
        switch (options1.get(state.field)) {
            case "text":
                return (<>
                    <Dropdown items={options2.text} selected={state.operator} setSelected={(p) => setSelected(p, 2)} />
                    <Input value={state.valuePrimary || ''} onChangeCapture={(e) => setSelected(e.currentTarget.value, 3)} />
                </>)
            case "date":

                return (<>
                    <div className="flex items-center gap-2">
                        <Label>הוא</Label>
                        <Dropdown items={options2.date} selected={state.operator} setSelected={(p) => {
                            setSelected(p, 2)
                        }}
                            width='fit-content' />
                    </div>
                    <div className="flex items-center gap-2">
                        <Label>עד</Label>
                        <Dropdown items={options2.date.filter((day) => Number(day) >= Number(state.operator))} selected={state.valuePrimary || ''} setSelected={(p) => setSelected(p, 3)} width='fit-content' />
                    </div>
                </>)
            case "amount":
                return <>
                    <Dropdown items={options2.amount} selected={state.operator} setSelected={(p) => setSelected(p, 2)} />
                    <Input name='user-input' value={state.valuePrimary} type={'number'} onChangeCapture={(e) => setSelected(e.currentTarget.value, 3)} />
                </>
            case "select":
                <div className="flex items-center gap-2">
                    <Label>הוא</Label>
                    <Dropdown items={options2.date} selected={state.operator} setSelected={(p) => {
                        setSelected(p, 2)
                    }}
                    />
                </div>

        }
    }


    return (
        // <div className='flex justify-evenly '>
        <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-1 flex justify-between items-center">
                <Button onClick={() => deleteRow(state.rowId)} variant='ghost' size="icon">
                    <Trash2Icon color='grey' />
                </Button>
                <Label >{label}</Label>
            </div>
            <Dropdown items={Array.from(options1, ([display, type]) => display)} selected={state.field} setSelected={(p) => setSelected(p, 1)} />
            {renderComponent()}
            {/* <Dropdown items={getOptions2(field)} selected={selected2} setSelected={setSelected2} /> */}

            {/* <Dropdown items={options1} selected={selected3} setSelected={setSelected3} /> */}
        </div>
    )
}

export default FilterRow