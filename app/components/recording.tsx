'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation';
import { Button, Textarea, Field, Input, Label, Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { createNote, getUser } from '../libs/action'
import Note from '../notes/[id]/note';

interface Note {
    user_email: string;
    course_id: string;
    course_title: string;
    note_title: string;
    note_content: string;
    note_tags: string[];
}

interface User {
    username: string;
    email: string;
}

export default function Recording() {
    const [noteData, setNoteData] = useState<string>("");
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const analyser = useRef<AnalyserNode | null>(null);
    const dataArray = useRef<Uint8Array | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const animationFrameId = useRef<number | null>(null);
    const [courseId, setCourseId] = useState<string>("");
    const [courseName, setCourseName] = useState<string>("");
    const [noteTitle, setNoteTitle] = useState<string>("");
    const [tags, setTags] = useState<string[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const prompt = `Create detailed, comprehensive study notes from the following transcript. Ensure that the notes include:
1. Key points and summaries of each main topic covered.
2. Definitions of any technical terms, with examples when relevant.
3. Step-by-step explanations for complex concepts.
4. Highlighted formulas, algorithms, or specific frameworks mentioned, with detailed descriptions of their applications.
5. Summary sections for each main topic and subtopic, followed by a concise conclusion that ties together the main learnings.

Format the notes in bullet points or numbered lists where helpful for clarity, and include headers for each topic and subtopic for easy navigation.

Transcript:`;
    const tagPrompt = `Create a list of tags for the following note, you should only return the tags, no other text, separated by commas: `;
    const titlePrompt = `Create a title for the following note with a maximum of 10 words, you should only return the title, no other text: `;

    enum RecordingStatus {
        Idle,
        Recording,
        Recorded,
        Processing,
        Error,
        Processed
    }

    const [currentStatus, setCurrentStatus] = useState(RecordingStatus.Idle);

    const onNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNoteData(event.target.value);
    };

    useEffect(() => {
        async function fetchUser() {
            const userData = await getUser();
            setUser(userData);
        }
        fetchUser();
    }, []);

    const handleSum = () => {
        // Initial POST request to start processing
        fetch("https://broad-frost-94f8.volume.workers.dev/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: prompt + noteData,
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
                    handleTitle();
                    handleTag();
                }
            });
        }).catch((error) => {
            console.error("Fetch error:", error);
        });
    };

    const handleTitle = () => {
        fetch("https://broad-frost-94f8.volume.workers.dev/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: titlePrompt + noteData,
            }),
        }).then((response) => {
            const reader = response.body?.getReader();
            if (!reader) {
                return;
            }

            const decoder = new TextDecoder();
            let buffer = "";
            let stringBuffer = "";
            setTags([]);

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
                        const json = JSON.parse(body);
                        stringBuffer += json.response;
                    }
                }

                if (value) {
                    reader.read().then(processText);
                } else {
                    reader.releaseLock();
                    setNoteTitle(stringBuffer);
                }

            });
        }).catch((error) => {
            console.error("Fetch error:", error);
        });
    };

    const handleTag = () => {
        fetch("https://broad-frost-94f8.volume.workers.dev/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: tagPrompt + noteData,
            }),
        }).then((response) => {
            const reader = response.body?.getReader();
            if (!reader) {
                return;
            }

            const decoder = new TextDecoder();
            let buffer = "";
            let stringBuffer = "";
            setTags([]);

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
                        const json = JSON.parse(body);
                        stringBuffer += json.response;
                    }
                }

                if (value) {
                    reader.read().then(processText);
                } else {
                    reader.releaseLock();
                    console.log(stringBuffer);
                    setTags(stringBuffer.split(',').map(tag => tag.trim()));
                    setCurrentStatus(RecordingStatus.Processed);
                }

            });
        }).catch((error) => {
            console.error("Fetch error:", error);
        });
    };

    const processRecording = useCallback(async (audioBlob: Blob) => {
        try {
            const response = await fetch('https://quiet-shape-df55.volume.workers.dev/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
                body: await audioBlob.arrayBuffer(),
            });

            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            // Parse the JSON response directly
            const result = await response.json();

            // Log the transcription result
            if (result.vtt) {
                console.log('Transcription result:', result.vtt);

                // Process each line and capture meaningful data
                const lines = result.vtt.split('\n');
                let transcriptionText = '';

                lines.forEach((line: string) => {
                    // Skip "WEBVTT" header and lines with timestamps or empty lines
                    if (line !== 'WEBVTT' && !line.includes('-->') && line.trim() !== '') {
                        transcriptionText += line + ' ';
                    }
                });

                // Set the accumulated transcription data
                setNoteData((prevData) => prevData + transcriptionText.trim());
                setCurrentStatus(RecordingStatus.Recorded);
            } else {
                console.error('Transcription failed, no VTT data found');
            }

        } catch (error) {
            console.error('Failed to process recording:', error);
        }
    }, [RecordingStatus.Recorded]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            const AudioContextClass: typeof AudioContext = window.AudioContext;
            audioContext.current = new AudioContextClass();
            analyser.current = audioContext.current.createAnalyser();
            const source = audioContext.current.createMediaStreamSource(stream);
            source.connect(analyser.current);
            analyser.current.fftSize = 256;
            const bufferLength = analyser.current.frequencyBinCount;
            dataArray.current = new Uint8Array(bufferLength);

            const updateVolume = () => {
                if (analyser.current && dataArray.current) {
                    analyser.current.getByteFrequencyData(dataArray.current);
                    const average = dataArray.current.reduce((acc, val) => acc + val, 0) / dataArray.current.length;
                    const newVolume = Math.min(100, (average / 128) * 100);
                    console.log('Volume:', newVolume);
                }
                animationFrameId.current = requestAnimationFrame(updateVolume);
            };
            updateVolume();

            if (mediaRecorder.current) {
                mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
                    audioChunks.current.push(event.data);
                };
                mediaRecorder.current.onstop = async () => {
                    if (animationFrameId.current) {
                        cancelAnimationFrame(animationFrameId.current);
                    }
                    const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                    const url = URL.createObjectURL(audioBlob);
                    console.log('Recording stopped:', url);
                    processRecording(audioBlob);
                };
                setCurrentStatus(RecordingStatus.Recording);
                mediaRecorder.current.start();
            }
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    }, [RecordingStatus.Recording, processRecording]);

    const stopRecording = useCallback(() => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
            console.log('Recording stopped');
            setCurrentStatus(RecordingStatus.Processing);
        } else {
            console.warn('No recording in progress to stop.');
        }
    }, [RecordingStatus.Processing]);

    const playRecording = useCallback(() => {
        if (audioChunks.current.length > 0) {
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
            const url = URL.createObjectURL(audioBlob);
            const audio = new Audio(url);
            audio.play();
        } else {
            console.warn('No audio data to play.');
        }
    }, []);

    const handleNoteCreation = async () => {
        try {

            const user = await getUser();
            if (!user) {
                console.error('User not logged in');
                return;
            }

            const note: Note = {
                user_email: user.email,
                course_id: courseId,
                course_title: courseName,
                note_title: noteTitle,
                note_content: noteData,
                note_tags: tags
            };

            const response = await createNote(note);
            if (response.success) {
                console.log('Note created successfully:', response.note);
                router.push(`/notes/${response.note.note_id}`);
            } else {
                console.error('Failed to create note:', response.error);
            }
        } catch (error) {
            console.error('Failed to create note:', error);
        }
    }

    const handleCopySuccess = () => {
        const button = document.querySelector('button:has(.ri-file-copy-line)');
        if (!button) return;

        const icon = button.querySelector('i');
        const text = button.lastChild;
        if (!icon || !text) return;

        icon.className = 'ri-check-line text-lg';
        text.textContent = ' Copied';

        setTimeout(() => {
            icon.className = 'ri-file-copy-line text-lg';
            text.textContent = ' Copy Note';
        }, 3000);
    };

    return (
        <div className="grid gap-4 my-4 w-full max-w-2xl bg-white">
            <Textarea
                className="w-full px-3 py-2 placeholder-gray-400 rounded-md border border-gray-300 bg-white text-sm text-gray-700
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200"
                value={noteData}
                onChange={onNoteChange}
                placeholder="Your note content will appear here..."
                rows={6}
            />

            <div className="flex flex-wrap gap-3 pt-4">
                <Button
                    onClick={startRecording}
                    disabled={currentStatus == RecordingStatus.Recording || currentStatus === RecordingStatus.Processing}
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white
                             hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 disabled:bg-gray-300 disabled:cursor-not-allowed
                             transition duration-200"
                    type="button">
                    <i className="ri-mic-line text-lg"></i>
                    Start Recording
                </Button>

                {currentStatus === RecordingStatus.Processed && (
                    <Button
                        onClick={() => navigator.clipboard.writeText(noteData)
                            .then(() => {
                                handleCopySuccess();
                            })
                        }
                        className="inline-flex items-center gap-2 rounded-md bg-gray-600 py-2 px-4 text-sm font-medium text-white
                             hover:bg-gray-700 focus:ring-2 focus:ring-gray-500/20 disabled:bg-gray-300 disabled:cursor-not-allowed
                             transition duration-200"
                        type="button">
                        <i className="ri-file-copy-line text-lg"></i>
                        Copy Note
                    </Button>
                )}

                {currentStatus !== RecordingStatus.Idle && currentStatus !== RecordingStatus.Recorded && currentStatus !== RecordingStatus.Processed && (
                    <Button
                        onClick={stopRecording}
                        disabled={currentStatus !== RecordingStatus.Recording}
                        className="inline-flex items-center gap-2 rounded-md bg-red-600 py-2 px-4 text-sm font-medium text-white
                                 hover:bg-red-700 focus:ring-2 focus:ring-red-500/20 disabled:bg-gray-300 disabled:cursor-not-allowed
                                 transition duration-200">
                        <i className="ri-stop-circle-line text-lg"></i>
                        Stop Recording
                    </Button>
                )}

                {currentStatus !== RecordingStatus.Idle && currentStatus !== RecordingStatus.Recording && (
                    <Button
                        onClick={playRecording}
                        className="inline-flex items-center gap-2 rounded-md bg-green-600 py-2 px-4 text-sm font-medium text-white
                                 hover:bg-green-700 focus:ring-2 focus:ring-green-500/20 transition duration-200">
                        <i className="ri-play-line text-lg"></i>
                        Play Recording
                    </Button>
                )}

                {currentStatus === RecordingStatus.Recorded && (
                    <Button
                        onClick={handleSum}
                        className="inline-flex items-center gap-2 rounded-md bg-purple-600 py-2 px-4 text-sm font-medium text-white
                                 hover:bg-purple-700 focus:ring-2 focus:ring-purple-500/20 transition duration-200">
                        <i className="ri-magic-line text-lg"></i>
                        Generate Summary
                    </Button>
                )}
            </div>

            <Disclosure as="div" className="pt-4 border border-gray-200 rounded-lg p-4" defaultOpen>
                <DisclosureButton className="group flex w-full items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 group-data-[hover]:text-gray-900">
                        Note Details
                    </span>
                    <i className="ri-arrow-down-s-line text-lg"></i>
                </DisclosureButton>
                <DisclosurePanel className="mt-4">
                    {user ? (
                        <div className="space-y-4">
                            <div className="grid gap-4">
                                <Field className="flex items-center justify-between gap-4">
                                    <Label htmlFor="noteTitle" className="text-sm font-medium text-gray-700 w-1/4">Note Title</Label>
                                    <Input
                                        id="noteTitle"
                                        type="text"
                                        value={noteTitle}
                                        onChange={(e) => setNoteTitle(e.target.value)}
                                        className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 w-3/4
                                                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200"
                                    />
                                </Field>

                                <Field className="flex items-center justify-between gap-4">
                                    <Label htmlFor="courseId" className="text-sm font-medium text-gray-700 w-1/4">Course Code</Label>
                                    <Input
                                        id="courseId"
                                        type="text"
                                        value={courseId}
                                        onChange={(e) => setCourseId(e.target.value)}
                                        className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 w-3/4
                                                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200"
                                    />
                                </Field>

                                <Field className="flex items-center justify-between gap-4">
                                    <Label htmlFor="courseName" className="text-sm font-medium text-gray-700 w-1/4">Course Name</Label>
                                    <Input
                                        id="courseName"
                                        type="text"
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                        className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 w-3/4
                                                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200"
                                    />
                                </Field>

                                <Field className="flex items-center justify-between gap-4">
                                    <Label htmlFor="tags" className="text-sm font-medium text-gray-700 w-1/4">Tags</Label>
                                    <Input
                                        id="tags"
                                        type="text"
                                        value={tags.join(', ')}
                                        onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
                                        className={`rounded-md border border-gray-300 py-2 px-3 text-sm text-gray-700 w-3/4
                                                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200`}
                                    />
                                </Field>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    onClick={handleNoteCreation}
                                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white
                                             hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 transition duration-200">
                                    <i className="ri-save-line text-lg"></i>
                                    Save Note
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-sm text-gray-600 mb-2">You need to be logged in to save notes</p>
                            <a 
                                href="/login"
                                className="inline-flex items-center gap-2 rounded-md bg-blue-600 py-2 px-4 text-sm font-medium text-white
                                         hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 transition duration-200"
                            >
                                <i className="ri-login-box-line text-lg"></i>
                                Login
                            </a>
                        </div>
                    )}
                </DisclosurePanel>
            </Disclosure>
        </div>
    );
}