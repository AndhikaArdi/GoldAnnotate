import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import Card from "@components/Card";
import Button from "@components/Button";
import { FormTitle } from "@components/Typography";
import useSession from "@hooks/useSession";

const FinishPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { endSession } = useSession();

  // Sesi diakhiri di sini (bukan di halaman kuis) supaya penjaga route tidak lebih dulu
  // mengalihkan ke "/". Hanya jika datang dari kuis (ada state), agar membuka /selesai
  // lewat URL tidak menghapus sesi siapa pun.
  useEffect(() => {
    if (state) endSession();
  }, [state, endSession]);

  if (!state) return <Navigate to="/" replace />;

  return (
    <Card className="px-5 py-8 text-center">
      <FormTitle>Terima kasih, {state.nama}!</FormTitle>
      <p className="mt-2 text-gray-600">
        Anotasi Anda untuk {state.groupLabel} sudah diselesaikan dan tersimpan.
      </p>
      <div className="mt-5">
        <Button onClick={() => navigate("/")}>Kembali ke Beranda</Button>
      </div>
    </Card>
  );
};

export default FinishPage;