import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putBook } from "@/services/BookService";
import type { Book } from "@/models/BookModel";

export default function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      newBook,
    }: {
      id: number;
      newBook: Partial<Book>;
    }) => {
      const result = await putBook(id, newBook);
      return result;
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      console.log("Livre mis à jour :", variables.id);
    },

    onError: (error, variables) => {
      console.error(
        "Erreur lors de la mise à jour du livre ID:",
        variables.id
      );
      console.error("Détails:", error);
    },
  });
}
