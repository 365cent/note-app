"use client";
import { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import Header from "./header/page"
import { Button } from '@headlessui/react'
import { Field, Description, Textarea } from '@headlessui/react'


export default function Home() {
	const [noteData, setNoteData] = useState<string>("");
	const noteText = useRef<HTMLTextAreaElement>(null);
	const prompt = `Create detailed, comprehensive study notes from the following transcript. Ensure that the notes include:
1. Key points and summaries of each main topic covered.
2. Definitions of any technical terms, with examples when relevant.
3. Step-by-step explanations for complex concepts.
4. Highlighted formulas, algorithms, or specific frameworks mentioned, with detailed descriptions of their applications.
5. Summary sections for each main topic and subtopic, followed by a concise conclusion that ties together the main learnings.

Format the notes in bullet points or numbered lists where helpful for clarity, and include headers for each topic and subtopic for easy navigation.

Transcript:`

	useEffect(() => {
		if (noteText.current) {
			noteText.current.scrollTop = noteText.current.scrollHeight;
		}
	}, [noteData]);

	const handleSum = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Initial POST request to start processing
		fetch("https://broad-frost-94f8.volume.workers.dev/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				message: prompt.concat(noteData),
			}),
		}).then((response) => {
			const reader = response.body?.getReader();
			if (!reader) {
				return;
			}

			const decoder = new TextDecoder();
			let buffer = "";
			setNoteData("");

			reader.read().then(function processText({ value }): void {

				buffer += decoder.decode(value, { stream: true });
				const parts = buffer.split("\n");
				buffer = parts.pop() || "";  // Save any incomplete data for the next chunk

				for (const part of parts) {
					if (part.startsWith("data: ")) {
						const body = part.slice(6);
						if (body === "[DONE]") {
							// end of message
							// console.log("Stream complete");
							break;
						}
						const json = JSON.parse(body); // Parse the JSON data after "data: "
						// console.log(json.response);
						setNoteData((prevData) => prevData + json.response); // Update DOM with each message
					}
				}

                if (value) {
                    reader.read().then(processText);
                } else {
                    reader.releaseLock();
                }
			});
		}).catch((error) => {
			console.error("Fetch error:", error);
		});
	};

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<Header />
			<main>
				<section className="grid gap-8 row-start-2 py-48" id="intro">
					<div className="flex flex-cols-2 items-center justify-center gap-4 md:justify-start">
						<Image
							className="dark:invert sm:hidden"
							src="/assets/logo.png"
							alt="Note.lat logo"
							width={64}
							height={64}
							priority
						/>
						<h2 className="text-3xl font-semibold">Note.lat</h2>
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
						<Link
							className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
							href="/create">
							<Image
								className="dark:invert"
								src="/vercel.svg"
								alt="Create Note"
								width={20}
								height={20}
							/>
							Start Now
						</Link>
						<Link
							className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
							href="#demo">
							Check our demo
						</Link>
					</div>
				</section>
				<section className="grid py-48" id="demo">
					<Field>
						<h2 className="text-3xl font-semibold">Demo</h2>
						<Description className="text-sm/6 text-black/50">Jot down your thoughts, get study notes in <span className="font-semibold">seconds</span>!</Description>
						<form className="grid gap-2"
							onSubmit={handleSum}>
							<Textarea className="mt-3 block w-full resize-none rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
								ref={noteText}
								value={noteData}
								onChange={e => setNoteData(e.target.value)}
								rows={6} />
							<div className="grid">
								<Button className="ml-auto inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
									type="submit">
									Create Note
								</Button>
							</div>
						</form>
					</Field>
				</section>
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
