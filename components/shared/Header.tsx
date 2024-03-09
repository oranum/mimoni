import Link from 'next/link';
import React from 'react';

const Header = () => {
    return (
        <header className="w-full border-b">
            <div className="container mx-auto flex justify-between items-center py-4">
                <Link className="text-2xl font-bold" href="/">
                    Mimoni
                </Link>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <Link href="/dashboard">
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/transactions">
                                Transactions
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
