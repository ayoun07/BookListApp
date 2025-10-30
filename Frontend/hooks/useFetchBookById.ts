import { useQuery } from "@tanstack/react-query";
import { getBookById } from "@/services/BookService";

export function useFetchBookById(id: number) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookById(id),
    enabled: !!id,
  });
}
