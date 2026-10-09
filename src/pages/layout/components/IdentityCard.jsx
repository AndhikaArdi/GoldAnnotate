import Card from "@components/Card";
import { FormTitle, HelperText } from "@components/Typography";
import { FormField } from "@components/FormControls";

const AccentBar = () => {
  return <div className="h-2.5 bg-brand" />;
};

const IdentityCard = ({ email, nama, errors, errorKey, onChange, onBlur }) => {
  return (
    <Card className="overflow-hidden">
      <AccentBar />
      <div className="px-5 pb-3 pt-5">
        <FormTitle>Goldset - Human Annotation</FormTitle>
        <HelperText tone="danger" className="mt-3">
          * menunjukkan pertanyaan yang wajib diisi
        </HelperText>
      </div>
      <FormField
        id="email"
        type="email"
        label="EMAIL"
        required
        placeholder="Jawaban Anda"
        value={email}
        error={errors.email}
        errorKey={errorKey}
        onChange={(e) => onChange("email", e.target.value)}
        onBlur={() => onBlur("email")}
      />
      <FormField
        id="nama"
        type="text"
        label="NAMA"
        required
        placeholder="Jawaban Anda"
        value={nama}
        error={errors.nama}
        errorKey={errorKey}
        onChange={(e) => onChange("nama", e.target.value)}
        onBlur={() => onBlur("nama")}
      />
    </Card>
  );
};

export default IdentityCard;
