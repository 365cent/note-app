'use client'

import { useState, useRef } from 'react'
import { Button } from '@headlessui/react'

interface Recommendation {
    title: string;
    similarity: number;
    id: string;
    description: string;
    date: string;
}

const mockRecommendations: Recommendation[] = [
    {
        id: '1',
        title: 'Introduction to Data Structures',
        similarity: 0.89,
        description: 'Covers basic concepts of arrays, linked lists and trees',
        date: '2024-01-15'
    },
    {
        id: '2',
        title: 'Algorithm Analysis',
        similarity: 0.75,
        description: 'Big O notation and complexity analysis',
        date: '2024-01-16'
    },
    {
        id: '3',
        title: 'Sorting Algorithms',
        similarity: 0.72,
        description: 'Implementation of quicksort and mergesort',
        date: '2024-01-17'
    },
    {
        id: '4',
        title: 'Graph Theory Basics',
        similarity: 0.68,
        description: 'Fundamental concepts of graphs and traversal',
        date: '2024-01-18'
    },
    {
        id: '5',
        title: 'Dynamic Programming',
        similarity: 0.65,
        description: 'Solving optimization problems using DP',
        date: '2024-01-19'
    }
];

export default function Recommendation({ noteId }: { noteId: string }) {
    const [recommendations] = useState<Recommendation[]>(mockRecommendations);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    console.log(noteId);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 320; // Width of one card + gap
            const newScrollPosition = scrollContainerRef.current.scrollLeft + 
                (direction === 'left' ? -scrollAmount : scrollAmount);
            
            scrollContainerRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="space-y-4 p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Similar Notes</h2>
                <div className="flex gap-2">
                    <button 
                        onClick={() => scroll('left')}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
            
            <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {recommendations.map((rec) => (
                    <div 
                        key={rec.id} 
                        className="flex-none w-80 snap-start"
                    >
                        <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors bg-white h-full">
                            <div className="flex flex-col h-full">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-gray-900 line-clamp-2">{rec.title}</h3>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        {Math.round(rec.similarity * 100)}%
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 flex-grow">
                                    {rec.description}
                                </p>
                                <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                                    <span className="text-xs text-gray-500">{rec.date}</span>
                                    <Button
                                        onClick={() => window.location.href = `/notes/${rec.id}`}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        View Note →
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


