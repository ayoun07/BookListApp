import { useMutation, useQueryClient } from "@tanstack/react-query";

type Payload = { bookId: number; rating: number };

const API = process.env.EXPO_PUBLIC_API_URL;

export function useUpdateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookId, rating }: Payload) => {
      const res = await fetch(`${API}/books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Impossible de mettre à jour la note");
      }
      return res.json();
    },

    onMutate: async ({ bookId, rating }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["bookById", bookId] }),
        queryClient.cancelQueries({ queryKey: ["books"] }),
      ]);

      const prevBook = queryClient.getQueryData<any>(["bookById", bookId]);
      const prevBooks = queryClient.getQueryData<any>(["books"]);

      if (prevBook) {
        queryClient.setQueryData(["bookById", bookId], { ...prevBook, rating });
      }
      if (Array.isArray(prevBooks)) {
        queryClient.setQueryData(
          ["books"],
          prevBooks.map((b: any) => (b.id === bookId ? { ...b, rating } : b))
        );
      }

      return { prevBook, prevBooks };
    },

    onError: (_err, { bookId }, ctx) => {
      if (ctx?.prevBook)
        queryClient.setQueryData(["bookById", bookId], ctx.prevBook);
      if (ctx?.prevBooks) queryClient.setQueryData(["books"], ctx.prevBooks);
    },

    onSuccess: (_data, { bookId }) => {
      queryClient.invalidateQueries({ queryKey: ["bookById", bookId] });
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
