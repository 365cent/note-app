'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Button, Textarea } from '@headlessui/react'

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
	}

	let [currentStatus, setCurrentStatus] = useState(RecordingStatus.Idle);

	const onNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNoteData(event.target.value);
	};

	const startRecording = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder.current = new MediaRecorder(stream);
			audioChunks.current = [];

			const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
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
	}, []);

	const stopRecording = useCallback(() => {
		if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
			mediaRecorder.current.stop();
			console.log('Recording stopped');
			setCurrentStatus(RecordingStatus.Processing);
		} else {
			console.warn('No recording in progress to stop.');
		}
	}, [currentStatus]);

	// mediaRecorder.current.onstop = async () => {
	// 	const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });

	// 	// Send audioBlob as a POST request to your backend
	// 	const response = await fetch('https://your-cloudflare-url.com', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/octet-stream',
	// 		},
	// 		body: await audioBlob.arrayBuffer(),
	// 	});

	// 	const result = await response.json();
	// 	console.log('Transcription result:', result);
	// };

	const processRecording = async (audioBlob: Blob) => {
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
				setCurrentStatus(RecordingStatus.Idle);
			} else {
				console.error('Transcription failed, no VTT data found');
			}
			
		} catch (error) {
			console.error('Failed to process recording:', error);
		}
	};



	return (
		<div className="grid gap-2 my-2 py-2 px-4 w-full max-w-lg divide-y divide-black/5 rounded-xl bg-black/5">
			<Textarea className="mt-3 block w-full resize-none rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
				value={noteData}
				onChange={onNoteChange}
				rows={6} />
			<div className="grid gap-2 mx-auto grid-cols-2 sm:grid-flow-col">
				<Button onClick={startRecording} disabled={currentStatus == RecordingStatus.Recording || currentStatus === RecordingStatus.Processing} className="ml-auto inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white disabled:bg-gray-200"
					type="submit">
					<i className="ri-mic-line"></i>
					Start Recording
				</Button>
				<Button onClick={stopRecording} disabled={currentStatus !== RecordingStatus.Recording} className="ml-auto inline-flex items-center gap-2 rounded-md bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600 hover:bg-red-600 data-[open]:bg-red-700 data-[focus]:outline-1 data-[focus]:outline-white disabled:bg-red-200">
					<i className="ri-stop-circle-line"></i>
					Stop Recording
				</Button>
				{currentStatus !== RecordingStatus.Idle && currentStatus !== RecordingStatus.Recording && (
					<Button className="ml-auto inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
						<i className="ri-play-line"></i>
						Play Recording
					</Button>)
				}
			</div>
		</div>

	);
}