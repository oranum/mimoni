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

// const data = [
//     {
//         month: 'January',
//         uv: 4000,
//         pv: 2400,
//         amt: 2400,
//     },
//     {
//         month: 'February',
//         uv: 3000,
//         pv: 1398,
//         amt: 2210,
//     },
//     {
//         month: 'Page C',
//         uv: 2000,
//         pv: 9800,
//         amt: 2290,
//     },
//     {
//         month: 'Page D',
//         uv: 2780,
//         pv: 3908,
//         amt: 2000,
//     },
//     {
//         month: 'Page E',
//         uv: 1890,
//         pv: 4800,
//         amt: 2181,
//     },
//     {
//         month: 'Page F',
//         uv: 2390,
//         pv: 3800,
//         amt: 2500,
//     },
//     {
//         month: 'Page G',
//         uv: 3490,
//         pv: 4300,
//         amt: 2100,
//     },
// ];

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



const MonthlyChart = ({ showBalance, data }: MonthlyChartProps) => {
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

export default MonthlyChart;


