import Card from "@components/Card";
import { FormTitle, SectionTitle, HelperText } from "@components/Typography";

const AccentBar = () => {
  return <div className="h-2.5 bg-brand" />;
};

const InfoRow = ({ label, value }) => {
  return (
    <div className="border-t border-line px-5 py-3">
      <HelperText>{label}</HelperText>
      <p className="font-medium">{value}</p>
    </div>
  );
};

const QuizHeaderCard = ({ group, email, nama }) => {
  return (
    <Card className="overflow-hidden">
      <AccentBar />
      <div className="px-5 pb-3 pt-5">
        <FormTitle>Goldset - Human Annotation</FormTitle>
        <SectionTitle className="mt-2">{group.toUpperCase()}</SectionTitle>
      </div>
      <InfoRow label="EMAIL" value={email} />
      <InfoRow label="NAMA" value={nama} />
    </Card>
  );
};

export default QuizHeaderCard;
