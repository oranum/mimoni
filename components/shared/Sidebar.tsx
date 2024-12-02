'use client'
import logo from '../../assets/images/logoipsum.svg'
import Link from 'next/link';
import React, { useEffect } from 'react';
import Image from 'next/image';
import { HomeIcon, LayoutListIcon, MenuIcon, Microscope, MicroscopeIcon, SearchIcon, SplitIcon, UploadIcon } from 'lucide-react';
import avatar from '../../assets/images/avatar.png';
import { useGetTransactions } from '@/lib/query-hooks/Transactions';

const ItemBadge = ({ value }: { value: number }) => {
    return (
        <div className='bg-red-500 text-white font-medium rounded-full w-4 h-4 flex justify-center items-center text-center text-xs'>
            {value}</div>
    )
}

const Sidebar = () => {

    const { transactions } = useGetTransactions('pending')

    // console.log('transactionsNumber', transactionsNumber)
    const menuItems = [
        { text: 'דף הבית', link: '/dashboard', icon: <HomeIcon /> },
        {
            text: 'מיון פעולות', link: '/inbox',
            icon: <SplitIcon />,
            badge: transactions?.length || ''
        },
        { text: 'תובנות', link: '/insights', icon: <MicroscopeIcon /> },
        // { text: 'פילטרים', link: '/filters', icon: <LayoutListIcon /> },
        { text: 'העלאת קובץ', link: '/upload', icon: <UploadIcon /> }
    ];

    return (
        <nav className="flex flex-col justify-between  min-w-[200px] h-screen bg-gray-800 text-white">
            <div className="flex flex-col justify-between"> {/* top */}
                <div className='flex justify-center items-center py-4 px-3'>
                    {/* <MenuIcon /> */}
                    <Link href="/">
                        <div className='flex justify-between w-full gap-2'>
                            <div className="text-2xl font-bold align-top w-full">Mimoni</div>
                            <Image src={logo} alt={'logo'} width={30} height={30} />
                        </div>
                    </Link>
                </div>
                <ul className="flex flex-col gap-5 mt-10 pr-5 pl-4">
                    {menuItems.map(item =>
                        <li key={item.text} className="flex justify-between items-center w-full">
                            <Link href={item.link} className='flex gap-3'>
                                {item.icon}
                                {item.text}
                            </Link>
                            {typeof item.badge === 'number' && <ItemBadge value={item.badge} />}
                        </li>)}

                </ul>
            </div>
            <div className='p-4 flex gap-3 items-center'>
                <Image src={avatar} alt={'avatar'} width={40} height={40} className='rounded-full' />

            </div>
        </nav >
    );
};


export default Sidebar;
