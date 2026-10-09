import { QueryClient } from "@tanstack/react-query";

// Error dari axios interceptor (langkah 4) punya properti { message, status, code, details }.
// Jangan mengulang request yang ditolak server karena kesalahan klien (4xx):
// 404/409/422 akan tetap gagal. Error jaringan/timeout (tanpa status) dan 5xx boleh diulang.
export const shouldRetry = (maxRetries) => (failureCount, error) =>
  failureCount < maxRetries && !(error?.status >= 400 && error?.status < 500);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry(2),
      staleTime: 60 * 1000,
      // Annotator sering pindah tab; jangan ambil ulang data (dan menimpa isian) tiap kembali ke tab.
      refetchOnWindowFocus: false,
    },
  },
});
