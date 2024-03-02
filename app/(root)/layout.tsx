import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import '../globals.css';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

const poppins = Poppins({
    subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-poppins'
});

export const metadata: Metadata = {
    title: 'Mimoni',
    description: 'Your money helper',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (


        <html lang="en">
            <body className="flex h-screen flex-col">
                <Header />
                <div className="flex-1">{children}</div>
                <Footer />
            </body>
        </html>
    );
}
