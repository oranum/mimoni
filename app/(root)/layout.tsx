import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '../globals.css';
import Header from '@/components/shared/Header';
import Footer from '@/Footer';
import Sidebar from '@/components/shared/Sidebar';

const poppins = Poppins({
    subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins'
});

export const metadata: Metadata = {
    title: 'Mimoni',
    description: 'Your money helper',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (

//html is rtl
        <html lang="he" dir="rtl">
            <body className="flex h-screen ">

                <Sidebar />
                <div className="flex-1 max-w-7xl mx-auto px-20 py-10">{children}</div>
            </body>
        </html>
    );
}
