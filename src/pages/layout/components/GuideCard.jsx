import Card from "@components/Card";
import { SectionTitle } from "@components/Typography";
import { GUIDES } from "@components/modal-contents";

const GuideRow = ({ children, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between border-t border-line px-5 py-3 text-left hover:bg-gray-50"
    >
      {children}
      <span aria-hidden="true">&gt;</span>
    </button>
  );
};

const GuideCard = ({ onOpen }) => {
  return (
    <Card>
      <SectionTitle className="px-5 pb-2 pt-4">PENJELASAN FORM</SectionTitle>
      {Object.entries(GUIDES).map(([key, g]) => (
        <GuideRow key={key} onClick={() => onOpen(key)}>
          {g.title}
        </GuideRow>
      ))}
    </Card>
  );
};

export default GuideCard;
