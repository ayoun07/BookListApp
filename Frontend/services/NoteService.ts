import apiClient from "@/api/apiClient";
import { Note } from "@/models/NoteModel";

export async function getNotes(id: number) {
    try {
        const response = await apiClient.get(`/Books/${id}/notes`);

            const notes: Note[] = response.data.map((note: any) => ({
              bookId: note.bookId,
              content: note.content,
              dateISO: note.dateISO,
            }));
        return notes;
    } catch (error) {
        console.error("Erreur lors de la récupération des notes :", error);
        throw error;
    }
}

export async function postNotes(id: number, newNote: Partial<Note>) {
    try {
        const response = await apiClient.post(`/Books/${id}/notes`, newNote);
        return response.data as Note
    } catch (error) {
        console.error("Erreur lors de l'ajout de la note", error);
        throw error;
    }
}