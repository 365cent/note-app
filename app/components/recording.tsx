'use client'

import { useState, useRef, useCallback } from 'react'
import { Button, Textarea, Field, Input, Label } from '@headlessui/react'
import { createNote } from '../libs/action'
import { getUserCookie } from '../libs/action'

interface Note {
    note_title: string,
    note_id: string,
    note_created_date: string,
    tag_name: string[],
    course_name: string,
    note_content: string
}

export default function Recording() {
    const [noteData, setNoteData] = useState<string>("");
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const analyser = useRef<AnalyserNode | null>(null);
    const dataArray = useRef<Uint8Array | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const animationFrameId = useRef<number | null>(null);

    enum RecordingStatus {
        Idle,
        Recording,
        Processing,
        Error,
        Processed
    }

    const [currentStatus, setCurrentStatus] = useState(RecordingStatus.Idle);

    const onNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNoteData(event.target.value);
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
                setCurrentStatus(RecordingStatus.Processed);
            } else {
                console.error('Transcription failed, no VTT data found');
            }

        } catch (error) {
            console.error('Failed to process recording:', error);
        }
    }, [RecordingStatus.Processed]);

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
            // const courseId = (document.getElementById('courseId') as HTMLInputElement).value;
            // const courseName = (document.getElementById('courseName') as HTMLInputElement).value;
            // const tags = (document.getElementById('tags') as HTMLInputElement).value;

            const userCookie = await getUserCookie();
            if (!userCookie) {
                console.error('User not logged in');
                return;
            }

            const note: Note = {
                note_title: 'Test Note',
                note_id: '123',
                note_created_date: '2024-01-01',
                tag_name: ['test', 'note'],
                course_name: 'Software Engineering',
                note_content: 'This is a test note',
            };

            const response = await createNote(note);
            if (response.success) {
                console.log('Note created successfully:', response.note);
            } else {
                console.error('Failed to create note:', response.error);
            }
        } catch (error) {
            console.error('Failed to create note:', error);
        }
    }

    return (
        <div className="grid gap-2 my-2 py-2 px-4 w-full max-w-lg divide-y divide-black/5 rounded-xl bg-gray-100">
            <Textarea className="mt-3 block w-full p-4 text-base font-sans border border-blue-500 rounded-md resize-y focus:outline focus:outline-3 focus:outline-blue-500/30 transition duration-300"
                value={noteData}
                onChange={onNoteChange}
                rows={6} />
            <div className="grid gap-2 ml-auto sm:grid-flow-col">
                <Button onClick={startRecording} disabled={currentStatus == RecordingStatus.Recording || currentStatus === RecordingStatus.Processing} className="ml-auto inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white disabled:bg-gray-200"
                    type="submit">
                    <i className="ri-mic-line"></i>
                    Start Recording
                </Button>
                {currentStatus !== RecordingStatus.Idle && currentStatus !== RecordingStatus.Processed && (
                    <Button onClick={stopRecording} disabled={currentStatus !== RecordingStatus.Recording} className="ml-auto inline-flex items-center gap-2 rounded-md bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600 hover:bg-red-600 data-[open]:bg-red-700 data-[focus]:outline-1 data-[focus]:outline-white disabled:bg-red-200">
                        <i className="ri-stop-circle-line"></i>
                        Stop Recording
                    </Button>
                )}
                {currentStatus !== RecordingStatus.Idle && currentStatus !== RecordingStatus.Recording && (
                    <Button onClick={playRecording} className="ml-auto inline-flex items-center gap-2 rounded-md bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600 data-[open]:bg-red-700 data-[focus]:outline-1 data-[focus]:outline-white">
                        <i className="ri-play-line"></i>
                        Play Recording
                    </Button>
                )}
            </div>
            <div className='grid gap-2 mt-2'>
                <div className="grid gap-2 mt-2">
                    <Field className="flex flex-row items-center gap-2">
                        <Label htmlFor="courseId" className="block text-sm font-medium text-gray-700 w-24 ml-auto">Course Id</Label>
                        <Input
                            id="courseId"
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Field>
                    <Field className="flex flex-row items-center gap-2">
                        <Label htmlFor="courseName" className="block text-sm font-medium text-gray-700 w-24 ml-auto">Course Name</Label>
                        <Input
                            id="courseName"
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Field>
                    <Field className="flex flex-row items-center gap-2">
                        <Label htmlFor="courseName" className="block text-sm font-medium text-gray-700 w-24 ml-auto">Tags</Label>
                        <Input
                            id="courseName"
                            type="text"
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-1.5 px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </Field>
                </div>
                <Button onClick={handleNoteCreation} className="ml-auto inline-flex items-center gap-2 rounded-md bg-blue-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-blue-600 data-[open]:bg-blue-700 data-[focus]:outline-1 data-[focus]:outline-white">
                    <i className="ri-save-line"></i>
                    Save Note
                </Button>
            </div>
        </div>
    );
}