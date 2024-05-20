import { ChevronLeft, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu'

const months = [
  'ינואר',
  'פברואר',
  'מרץ',
  'אפריל',
  'מאי',
  'יוני',
  'יולי',
  'אוגוסט',
  'ספטמבר',
  'אוקטובר',
  'נובמבר',
  'דצמבר'
]

type MonthSelectorProps = {
  selectedMonth: Date
  setSelectedMonth: React.Dispatch<React.SetStateAction<Date>>
}

const MonthSelector = ({ selectedMonth, setSelectedMonth }: MonthSelectorProps) => {

  // const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [isOpen, setIsOpen] = useState(false)
  const [year, setYear] = useState<number>(selectedMonth.getFullYear())
  const disabled = selectedMonth.getMonth() === new Date().getMonth() && selectedMonth.getFullYear() === new Date().getFullYear()

  const handleChangeMonth = (action: 'next' | 'prev') => {
    const newDate = new Date(selectedMonth)
    if (action === 'next') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setSelectedMonth(newDate)
  }

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-row justify-between items-center gap-3 w-[300px]" >
        <Button variant='outline' size='sm' onClick={() => handleChangeMonth('prev')} >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>

        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger >
            <Button className='w-[120px] '>{new Intl.DateTimeFormat('he-IL', { year: 'numeric', month: 'long' }).format(selectedMonth)
            }</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='flex flex-col items-center justify-center pb-4'>
            <YearSelector year={year} setYear={setYear} />
            <div className='flex flex-col gap-2'>
              {months.map((month, index) => (
                <Button
                  key={index}
                  variant='outline'
                  onClick={() => {
                    const newDate = new Date(selectedMonth)
                    newDate.setMonth(index)
                    newDate.setFullYear(year)
                    setSelectedMonth(newDate)
                    setIsOpen(false)
                  }}
                  disabled={year === new Date().getFullYear() && index > new Date().getMonth()}
                  className={selectedMonth.getMonth() === index ? 'bg-primary text-white' : ''}

                >
                  {month}
                </Button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>


        <Button variant='outline' disabled={disabled} size='sm' onClick={() => handleChangeMonth('next')} >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
      </div >

    </div >
  )
}

export default MonthSelector


const YearSelector = ({ year, setYear }: {
  year: number, setYear: React.Dispatch<React.SetStateAction<number>>
}) => {

  const handleChangeYear = (action: 'next' | 'prev') => {
    action === 'next' ? setYear(year + 1) : setYear(year - 1)
  }
  return (
    <div className='flex flex-row justify-between items-center w-full px-4'>
      <Button variant='ghost' disabled={year === new Date().getFullYear()} size='icon' onClick={() => handleChangeYear('next')} >
        <ChevronLeftIcon className='h-5 w-5 cursor-pointer' />
      </Button>
      <DropdownMenuLabel className='font-bold py-3'>{year}</DropdownMenuLabel>
      <Button variant='ghost' size='icon' onClick={() => handleChangeYear('prev')} >
        <ChevronRightIcon className='h-5 w-5 cursor-pointer' />
      </Button>
    </div>

  )
}

