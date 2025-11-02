import React from "react";
import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { RatingsProvider } from "@/contexts/RatingsContext";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <RatingsProvider>
          <Stack />
        </RatingsProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  );
}
