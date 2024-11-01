"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from '@headlessui/react'
import { Textarea } from '@headlessui/react'


export default function Home() {
	const handleClick = () => {
		fetch("https://neo4j-backend-three.vercel.app/api/addUser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message: "This is a test note",
			}),
		}).then((response) => {
			console.log(response);
		}).catch((error) => {
			console.error(error);
		});
	}

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
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
			<main className="grid gap-8 row-start-2 items-center sm:items-start">
				<div className="flex flex-cols-2 items-center justify-center gap-4 md:justify-start">
					<Image
						className="dark:invert sm:hidden"
						src="/assets/logo.png"
						alt="Note.lat logo"
						width={64}
						height={64}
						priority
					/>
					<p className="text-3xl font-semibold">Note.lat</p>
				</div>
				<ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
					<li className="mb-2">
						Get started by recoding a{" "}
						<code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
							Lecture
						</code>
						.
					</li>
					<li><i className="text-lg">☕</i> Sit back and relax.</li>
					<li><i className="text-lg">🎉</i> Tada! All your course note is here.</li>
				</ol>

				<div className="flex gap-4 items-center flex-col sm:flex-row">
					<button
						className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
						onClick={handleClick}
					>
						<Image
							className="dark:invert"
							src="/vercel.svg"
							alt="Vercel logomark"
							width={20}
							height={20}
						/>
						Test Request
					</button>
					<a
						className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
						href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						Read our docs
					</a>
				</div>


          <Textarea
          className="mt-3 block w-full resize-none rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
            // className={clsx(
            //   'mt-3 block w-full resize-none rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black',
            //   'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
            // )}
            rows={3}
          />
			</main>
			<footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="/file.svg"
						alt="File icon"
						width={16}
						height={16}
					/>
					Learn
				</a>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="/window.svg"
						alt="Window icon"
						width={16}
						height={16}
					/>
					Examples
				</a>
				<a
					className="flex items-center gap-2 hover:underline hover:underline-offset-4"
					href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Image
						aria-hidden
						src="/globe.svg"
						alt="Globe icon"
						width={16}
						height={16}
					/>
					Go to nextjs.org →
				</a>
			</footer>
		</div>
	);
}
