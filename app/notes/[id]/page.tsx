import { getUser } from '../../libs/action';
import { notFound } from 'next/navigation'
import Note from './note'


interface Note {
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
    courseId?: string
    courseName?: string
    tags: string[]
}

type NotePageProps = Promise<{ id: string }>


async function getNote(id: string): Promise<Note> {
    try {
        const response = await fetch(`https://dash.note.lat/api/getANote?note_id=${id}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                return notFound();
            }
            throw new Error('Failed to fetch note');
        }

        const data = await response.json();
        
        if (!data.success || !data.data[0]) {
            return notFound();
        }

        const noteData = data.data[0];
        
        return {
            id: noteData.note_id,
            title: noteData.note_title,
            content: noteData.note_content,
            createdAt: noteData.note_created_date || new Date().toISOString(),
            updatedAt: noteData.note_created_date || new Date().toISOString(),
            courseName: noteData.course_of_note,
            tags: noteData.tag_name || []
        };

    } catch (error) {
        console.error('Error fetching note:', error);
        throw error;
    }
}

export default async function NotePage(props: { params: NotePageProps }) {
    const { id } = await props.params;
    const user = await getUser();
    
    // console.log(params)
    const note = await getNote(id)
    return (
        <div className="min-h-screen bg-white">
            <Note note={note} user={user} />
        </div>
    )
}
