import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@headlessui/react';
import Form from './form';


export default function Login() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Head>
                <title>About Note.lat</title>
            </Head>
            <header className="flex items-center justify-between row-start-1 w-full">
                <div className="flex items-center gap-4">
                    <Image
                        className="dark:invert"
                        src="/assets/logo.png"
                        alt="Note.lat logo"
                        width={32}
                        height={32}
                        priority
                    />
                    <h1 className="text-xl font-semibold">Note.lat</h1>
                    <span className="hidden sm:block">Lecture note has never been so easy</span>
                </div>
                <nav>
                    <Link href="/login">
                        <Button className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                            Create Now
                        </Button>
                    </Link>
                </nav>
            </header>
            <main>
                <Form />
            </main>
        </div>
    );
}