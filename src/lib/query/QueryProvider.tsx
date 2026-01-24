"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./client";
import { ReactNode } from "react";

interface iProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: iProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
