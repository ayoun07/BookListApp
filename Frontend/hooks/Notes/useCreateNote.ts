import { Note } from "@/models/NoteModel";
import { postNotes } from "@/services/NoteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateNote(bookId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newNote: Partial<Note>) => postNotes(bookId, newNote),

    onSuccess: (data) => {
      console.log("Note créée :", data);

      queryClient.invalidateQueries({
        queryKey: ["Note", bookId],
      });
    },

    onError: (error) => {
      console.error("Erreur lors de la création de la note :", error);
    },
  });
}
