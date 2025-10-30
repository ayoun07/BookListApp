import { useQuery } from "@tanstack/react-query";
import {getBooks} from "@/services/BookService";
import { Book } from "@/models/BookModel";

export function useFetchBooks() {
  return useQuery<Book[], Error>({
    queryKey: ["books"],
    queryFn: getBooks,
  });
}
