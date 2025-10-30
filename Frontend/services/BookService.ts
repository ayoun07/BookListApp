import { Book } from "@/models/BookModel";
import apiClient from "@/api/apiClient";

export async function getBooks() {
  try {
    const response = await apiClient.get("/Books");

    const book = response.data.map(
      ({
        id,
        name,
        author,
        editor,
        year,
        read,
        favorite,
        rating,
        cover,
        theme,
      }: {
        id: number;
        name: string;
        author: string;
        editor: string;
        year: number;
        read: boolean;
        favorite: boolean;
        rating: number;
        cover: string;
        theme: string;
      }) => ({
        id,
        name,
        author,
        editor,
        year,
        read,
        favorite,
        rating,
        cover,
        theme,
      })
    );
    return book;
  } catch (error) {
    console.error("Erreur lors de la recuperation des livres:", error);
    throw error;
  }
}

export async function getBookById(id: number) {
  try {
    const response = await apiClient.get(`/Books/${id}`);
    const bookById = {
      id: response.data.id,
      name: response.data.name,
      author: response.data.author,
      editor: response.data.editor,
      year: response.data.year,
      read: response.data.read,
      favorite: response.data.favorite,
      rating: response.data.rating,
      cover: response.data.cover,
      theme: response.data.theme,
    };
    return bookById;
  } catch (error) {
    console.error("Erreur lors de la recuperation du livre par ID:", error);
    throw error;
  }
}

export async function postBook(newBook: Partial<Book>) {
  try {
    const response = await apiClient.post("/Books", newBook);
    return response.data as Book;
  } catch (error) {
    console.error("Erreur lors de la création du livre:", error);
    throw error;
  }
}
