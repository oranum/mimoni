

import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '../globals.css';
import Sidebar from '@/components/shared/Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { ReactQueryProvider } from './ReactQueryProvider';

const poppins = Poppins({
    subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins'
});

export const metadata: Metadata = {
    title: 'Mimoni',
    description: 'Your money helper',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (

        <html lang="he" dir="rtl">
            <body className="flex h-screen ">
                <ReactQueryProvider>
                    <Sidebar />
                    <div className="flex-1 max-w-full mx-auto px-20 py-10">{children}</div>
                    <Toaster />
                </ReactQueryProvider>
            </body>
        </html>
    );
}
