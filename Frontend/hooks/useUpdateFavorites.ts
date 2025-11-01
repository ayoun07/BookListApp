import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";

export function useUpdateFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      bookId,
      favorite,
    }: {
      bookId: number;
      favorite: boolean;
    }) => {
      const response = await apiClient.patch(`/Books/${bookId}`, { favorite });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["book", variables.bookId] });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour du favori:", error);
    },
  });
}
