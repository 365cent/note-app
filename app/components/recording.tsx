'use client'

import { useState, useRef, useCallback } from 'react'
import { Button, Textarea, Field, Input, Label } from '@headlessui/react'
import { createNote, getUser } from '../libs/action'
import Note from '../notes/[id]/note';


interface Note {
    user_email: string;
    course_id: string;
    note_title: string;
    note_content: string;
    note_tags: string[];
}

export default function Recording() {
    const [noteData, setNoteData] = useState<string>("");
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioContext = useRef<AudioContext | null>(null);
    const analyser = useRef<AnalyserNode | null>(null);
    const dataArray = useRef<Uint8Array | null>(null);
    const audioChunks = useRef<Blob[]>([]);
    const animationFrameId = useRef<number | null>(null);
    const [courseId] = useState<string>("");
    const [courseName] = useState<string>("");
    const [tags] = useState<string[]>([]);

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

            const user = await getUser();
            if (!user) {
                console.error('User not logged in');
                return;
            }

            const note: Note = {
                user_email: user.email,
                course_id: courseId,
                note_title: courseName,
                note_content: noteData,
                note_tags: tags
            };

            console.log(note);

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

                {currentStatus !== RecordingStatus.Recording && currentStatus !== RecordingStatus.Processing && (
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

                {currentStatus !== RecordingStatus.Idle && currentStatus !== RecordingStatus.Processed && (
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
            </div>

            <div className="space-y-4 pt-4">
                <div className="grid gap-4">
                    <Field className="flex items-center justify-between gap-4">
                        <Label htmlFor="courseId" className="text-sm font-medium text-gray-700 w-1/4">Course Code</Label>
                        <Input
                            id="courseId"
                            type="text"
                            value={courseId}
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
                            className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 w-3/4
                                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200"
                        />
                    </Field>

                    <Field className="flex items-center justify-between gap-4">
                        <Label htmlFor="tags" className="text-sm font-medium text-gray-700 w-1/4">Tags</Label>
                        <Input
                            id="tags"
                            type="text"
                            className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-700 w-3/4
                                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition duration-200"
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
        </div>
    );
}