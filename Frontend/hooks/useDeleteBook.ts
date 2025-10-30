// hooks/useDeleteBook.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBook } from "@/services/BookService";

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
          const result = await deleteBook(id);
          console.log("Deleting book id:", id);
      return result;
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
    onError: (error: any, id) => {
      console.error("❌ Erreur lors de la suppression du livre ID:", id);
      console.error("❌ Détails:", error.response?.data || error.message);
    },
  });
}
