'use client'

import { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


// const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//         return (
//             <div className="custom-tooltip">
//                 <p className="label">{`${label} : ${payload[0].value}`}</p>
//                 <p className="intro">{getIntroOfPage(label)}</p>
//                 <p className="desc">Anything you want can be displayed here.</p>
//             </div>
//         );
//     }
// }


export type ChartData = {
    month: string;
    sumIncome: number;
    sumExpenses: number;
    balance: number;
};

type MonthlyChartProps = {
    showBalance: boolean;
    data: ChartData[];

};



const YearlyBarChart = ({ showBalance, data }: MonthlyChartProps) => {
    return (


        <ResponsiveContainer width="100%" height="100%" >
            <BarChart
                width={600}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 10,
                    bottom: 5,
                }}
            >
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                {/* <Legend /> */}
                <Bar dataKey='sumIncome' fill="#18181B" radius={[5, 5, 0, 0]} />
                <Bar dataKey='sumExpenses' fill="#A1A1AA" radius={[5, 5, 0, 0]} />
                {showBalance && <Bar dataKey="balance" fill="#D7D7D7" radius={[5, 5, 0, 0]} />}
            </BarChart>
        </ResponsiveContainer>
    );
}

export default YearlyBarChart;


