import Head from 'next/head';
import Form from './form';
import Header from "../components/header"

export default function Signup() {

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Head>
                <title>Signup Note.lat</title>
            </Head>
            <Header />
            <main className="w-full max-w-screen-sm">
                <Form />
            </main>
        </div>
    );
}