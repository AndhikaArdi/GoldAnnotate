import Card from "@components/Card";
import Button, { CloseButton } from "@components/Button";
import { Radio, Checkbox } from "@components/FormControls";
import { getAspekLabel } from "@/data/aspek";
import { isAnswerDone } from "@helpers/answer";

const SENTIMENTS = ["Positif", "Netral", "Negatif"];

const StarRating = ({ value, max = 5 }) => {
  return (
    <span className="text-amber-500" aria-label={`${value} dari ${max}`}>
      {"★".repeat(value)}
      <span className="text-gray-300">{"★".repeat(max - value)}</span>
    </span>
  );
};

const StatusText = ({ done }) => {
  return (
    <p className={`text-xs ${done ? "text-green-600" : "text-gray-500"}`}>
      {done ? "Selesai ✓" : "Belum diisi"}
    </p>
  );
};

const QuestionHeader = ({ number, stars, done }) => {
  return (
    <header className="flex items-center justify-between">
      <p className="font-semibold">
        {number}. <StarRating value={stars} /> ({stars}/5)
      </p>
      <StatusText done={done} />
    </header>
  );
};

const SentimentRadios = ({ name, value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-x-5 gap-y-1">
      {SENTIMENTS.map((opt) => (
        <Radio
          key={opt}
          compact
          name={name}
          value={opt}
          label={opt}
          checked={value === opt}
          onChange={() => onChange(opt)}
        />
      ))}
    </div>
  );
};

const AspectCard = ({ name, radioName, sentiment, onSentiment, onRemove }) => {
  return (
    <div className="flex items-stretch rounded-md border border-gray-200">
      <div className="flex-1 px-3 py-2.5">
        <p className="text-sm font-semibold">{name}</p>
        <div className="mt-2">
          <SentimentRadios
            name={radioName}
            value={sentiment}
            onChange={onSentiment}
          />
        </div>
      </div>
      <div className="flex items-center px-3">
        <CloseButton
          tone="danger"
          label={`Hapus aspek ${name}`}
          onClick={onRemove}
        />
      </div>
    </div>
  );
};

const AspectPlaceholder = ({ variant = "empty" }) => {
  if (variant === "none") {
    return (
      <div className="rounded-md bg-red-600 px-4 py-6 text-center font-semibold text-white">
        Review ini Tidak membahas Aspek apapun
      </div>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-6 text-center text-xs text-gray-500">
      Tidak ada Aspek yang dipilih
      <br />
      Klik '+ Tambah Aspek' untuk mulai
    </div>
  );
};

const QuestionCard = ({
  id,
  index,
  review,
  answer,
  onToggleNone,
  onAdd,
  onRemove,
  onSentiment,
}) => {
  return (
    <Card as="article" className="p-5">
      <QuestionHeader
        number={index + 1}
        stars={review.stars}
        done={isAnswerDone(answer)}
      />

      <blockquote className="mt-3 leading-relaxed">"{review.text}"</blockquote>

      <div className="mt-4 flex items-center justify-between">
        <Checkbox
          label="Tidak Ada Aspek"
          checked={answer.none}
          onChange={(e) => onToggleNone(e.target.checked)}
        />
        <Button size="sm" disabled={answer.none} onClick={onAdd}>
          + Tambah Aspek
        </Button>
      </div>

      <div className="mt-3">
        {answer.none ? (
          <AspectPlaceholder variant="none" />
        ) : answer.aspects.length === 0 ? (
          <AspectPlaceholder variant="empty" />
        ) : (
          <div className="space-y-2">
            {answer.aspects.map((a) => (
              <AspectCard
                key={a.key}
                name={getAspekLabel(a.key)}
                radioName={`${id}-${a.key}`}
                sentiment={a.sentiment}
                onSentiment={(s) => onSentiment(a.key, s)}
                onRemove={() => onRemove(a.key)}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuestionCard;
