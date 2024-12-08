import Header from "../components/homeHeader";
import Recording from "../components/recording";

export default function Create() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <Header />
            <main className="mx-auto max-w-screen-sm w-full">
                <h1 className="text-3xl font-semibold mx-auto">Create Note</h1>
                <Recording />
            </main>
        </div>
    );
}