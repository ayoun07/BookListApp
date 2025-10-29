import apiClient from "@/api/apiClient";

export default async function getBooks() {
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
