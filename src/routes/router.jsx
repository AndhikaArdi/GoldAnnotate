import { createHashRouter, Navigate } from "react-router";
import RootLayout from "./RootLayout";
import RequireSession from "./RequireSession";
import LandingPage from "@goldset_form/landing";
import QuizPage from "@goldset_form/quiz";
import FinishPage from "@goldset_form/finish";
import NotFoundPage from "@pages/not-found";
import RouteErrorPage from "@pages/route-error";

// Router berbasis hash (#/kuis/1): GitHub Pages tidak bisa mengarahkan semua alamat
// ke index.html, jadi refresh dan tautan langsung hanya aman dengan hash.
const router = createHashRouter([
  {
    element: <RootLayout />,
    // Menangkap error tak terduga dari layout dan semua halaman di bawahnya.
    errorElement: <RouteErrorPage />,
    children: [
      { path: "/", element: <LandingPage /> },
      {
        element: <RequireSession />,
        children: [
          { path: "/kuis", element: <Navigate to="/kuis/1" replace /> },
          { path: "/kuis/:halaman", element: <QuizPage /> },
        ],
      },
      // Di luar penjaga sesi: sesi diakhiri oleh halaman ini sendiri.
      { path: "/selesai", element: <FinishPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;