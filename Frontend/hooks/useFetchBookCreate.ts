import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postBook } from "@/services/BookService";
import { Book } from "@/models/BookModel";

export default function useFetchBookCreate() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newBook: Partial<Book>) => postBook(newBook),
    onSuccess: (data) => {
      console.log("Livre créé :", data);
      queryClient.invalidateQueries({queryKey: ["books"]});
    },
    onError: (error) => {
      console.error("Erreur création livre :", error);
    },
  });

  return mutation;
}
