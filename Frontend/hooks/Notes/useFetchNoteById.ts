import {getNotes} from "@/services/NoteService";
import { useQuery } from "@tanstack/react-query";

export function useFetchNoteById(id: number) {
    return useQuery({
        queryKey: ["Note", id],
        queryFn: () => getNotes(id),
    });
}