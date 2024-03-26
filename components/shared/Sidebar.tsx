
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import logo from '../../assets/images/logoipsum.svg'
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { HomeIcon, MenuIcon, Microscope, MicroscopeIcon, SearchIcon, SplitIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import avatar from '../../assets/images/avatar.png';



const Sidebar = () => {
    const menuItems = [
        { text: 'דף הבית', link: '/dashboard', icon: <HomeIcon /> },
        { text: 'תובנות', link: '/insights', icon: <MicroscopeIcon /> },
        { text: 'מיון פעולות', link: '/dashboard', icon: <SplitIcon /> },
    ];

    return (
        <nav className="flex flex-col justify-between min-w-[200px] h-screen bg-gray-800 text-white">
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
                <ul className="flex flex-col gap-5 mt-10 pr-5">
                    {menuItems.map(item =>
                        <li key={item.text} className="flex justify-start align-middle text-center w-full">
                            <Link href={item.link} className='flex gap-3'>
                                {item.icon}
                                {item.text}
                            </Link>
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
