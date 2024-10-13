import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconProps } from '@radix-ui/react-icons/dist/types'
import { CoinsIcon, LucideIcon, LucideProps } from 'lucide-react'
import React, { ComponentType } from 'react'

type DataCardProps = {
    title: string
    amount: string | number
    info?: string
    Icon: React.ComponentType<LucideProps>
}



const DataCard = ({ title, amount, info, Icon }: DataCardProps) => {

    if (typeof amount === 'number') {
        amount = amount.toLocaleString('he-IL', { style: 'currency', currency: 'ILS', maximumFractionDigits: 0 })
    }

    return (
        <Card >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>

                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{amount}</div>
                <p className="text-xs text-muted-foreground">
                    {info}
                </p>
            </CardContent>
        </Card>
    )
}

export default DataCard