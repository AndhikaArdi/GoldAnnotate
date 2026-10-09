import { useNavigate } from "react-router";
import Card from "@components/Card";
import Button from "@components/Button";
import { SectionTitle, HelperText } from "@components/Typography";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Card className="px-5 py-6 text-center">
      <SectionTitle>Halaman tidak ditemukan</SectionTitle>
      <HelperText className="mt-2">
        Alamat yang Anda buka tidak tersedia.
      </HelperText>
      <div className="mt-4">
        <Button onClick={() => navigate("/")}>Kembali ke Beranda</Button>
      </div>
    </Card>
  );
};

export default NotFoundPage;
