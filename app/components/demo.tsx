'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@headlessui/react'
import { Field, Description, Textarea } from '@headlessui/react'

export default function Demo() {
  const [noteData, setNoteData] = useState<string>("");
  const noteText = useRef<HTMLTextAreaElement>(null);
  const prompt = `Create detailed, comprehensive study notes from the following transcript. Ensure that the notes include:
1. Key points and summaries of each main topic covered.
2. Definitions of any technical terms, with examples when relevant.
3. Step-by-step explanations for complex concepts.
4. Highlighted formulas, algorithms, or specific frameworks mentioned, with detailed descriptions of their applications.
5. Summary sections for each main topic and subtopic, followed by a concise conclusion that ties together the main learnings.

Format the notes in bullet points or numbered lists where helpful for clarity, and include headers for each topic and subtopic for easy navigation.

Transcript:`;

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
              break;
            }
            const json = JSON.parse(body); // Parse the JSON data after "data: "
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
  );
}

