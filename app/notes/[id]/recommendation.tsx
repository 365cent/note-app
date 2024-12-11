'use client'

import { useState, useRef, useEffect } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel, Button} from '@headlessui/react'

interface Recommendation {
    title: string;
    id: number;
    description: string;
    date: string;
}

const fetchRecommendations = async (noteId: string): Promise<Recommendation[]> => {
    try {
        const response = await fetch(`https://dash.note.lat/api/recommendByTag?note_id=${noteId}`);
        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.message);
        }

        return result.data.map((note: any) => ({
            id: Number(note.note_id),
            title: note.note_title,
            description: note.note_content.substring(0, 100) + '...', // First 100 chars as preview
            date: note.note_created_date
        }));
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
};

export default function Recommendation({ noteId }: { noteId: string }) {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadRecommendations = async () => {
            const data = await fetchRecommendations(noteId);
            setRecommendations(data);
        };
        loadRecommendations();
    }, [noteId]);

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

    if (recommendations.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <Disclosure as="div" className="mb-4" defaultOpen={true}>
                <div className="flex justify-between items-center">
                    <DisclosureButton className="group flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recommended to you</h2>
                        <i className="ri-arrow-down-s-line transition-transform group-hover:translate-y-0.5"></i>
                    </DisclosureButton>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => scroll('left')}
                            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            aria-label="Scroll left"
                        >
                            <i className="ri-arrow-left-s-line text-gray-600 dark:text-gray-300"></i>
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            aria-label="Scroll right"
                        >
                            <i className="ri-arrow-right-s-line text-gray-600 dark:text-gray-300"></i>
                        </button>
                    </div>
                </div>
                
                <DisclosurePanel>
                    <div 
                        ref={scrollContainerRef}
                        className="flex overflow-x-auto gap-4 py-4 snap-x snap-mandatory scrollbar-hide mt-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {recommendations.slice(0, 10).map((rec, index) => (
                            <div 
                                key={`${rec.id}-${index}`} 
                                className="flex-none w-80 snap-start"
                            >
                                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 bg-white dark:bg-gray-800 h-full shadow-sm hover:shadow-md transform hover:-translate-y-1">
                                    <div className="flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">{rec.title}</h3>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 flex-grow line-clamp-3">
                                            {rec.description}
                                        </p>
                                        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{rec.date}</span>
                                            <Button
                                                onClick={() => window.location.href = `/notes/${rec.id}`}
                                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 group flex items-center gap-1"
                                            >
                                                View Note
                                                <span className="transform transition-transform group-hover:translate-x-1">→</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </DisclosurePanel>
            </Disclosure>
        </div>
    );
}
