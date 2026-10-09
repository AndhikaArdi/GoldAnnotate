import { useEffect } from "react";
import { useNavigate, useRouteError } from "react-router";
import PageLayout from "@pages/layout/PageLayout";
import Card from "@components/Card";
import Button from "@components/Button";
import { FormTitle } from "@components/Typography";

// Dipasang sebagai errorElement di router. Menggantikan seluruh layout,
// jadi halaman ini membawa PageLayout sendiri.
const RouteErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  // Detail teknis hanya untuk Anda (console), bukan untuk annotator.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageLayout>
      <Card className="px-5 py-8 text-center">
        <FormTitle>Terjadi kesalahan</FormTitle>
        <p className="mt-2 text-gray-600">
          Maaf, ada masalah tak terduga di halaman ini. Jawaban yang sudah
          tersimpan otomatis tetap aman.
        </p>
        {import.meta.env.DEV && error?.message && (
          <p className="mt-3 rounded bg-gray-100 p-2 text-left font-mono text-xs text-gray-700">
            {String(error.message)}
          </p>
        )}
        <div className="mt-5 flex justify-center gap-2">
          <Button variant="outline" onClick={() => navigate("/")}>
            Ke Beranda
          </Button>
          <Button onClick={() => window.location.reload()}>Muat Ulang</Button>
        </div>
      </Card>
    </PageLayout>
  );
};

export default RouteErrorPage;