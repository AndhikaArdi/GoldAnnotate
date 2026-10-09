import Card from "@components/Card";
import { SectionTitle, HelperText } from "@components/Typography";
import { Radio, FieldError } from "@components/FormControls";
import { SkeletonBlock, QueryError } from "@components/LoadingStates";

// Mengelompokkan berdasarkan awalan label: "Group B1" dan "Group B2" masuk ke "Group B".
const buildSections = (groups) => {
  const sections = new Map();
  groups.forEach((g) => {
    const title = g.label.match(/^Group\s+[A-Za-z]+/)?.[0] ?? g.label;
    sections.set(title, [...(sections.get(title) ?? []), g]);
  });
  return [...sections].map(([title, options]) => ({ title, options }));
};

const GroupSection = ({ title, options, name, value, onChange }) => {
  return (
    <div className="border-t border-line px-5 py-3">
      <p className="font-semibold">{title}</p>
      <div className="mt-2 space-y-1">
        {options.map((g) => (
          <Radio
            key={g.id}
            name={name}
            value={g.id}
            label={g.label}
            checked={value === g.id}
            onChange={() => onChange(g.id)}
          />
        ))}
      </div>
    </div>
  );
};

const GroupSkeleton = () => {
  return (
    <div
      role="status"
      aria-label="Memuat daftar group"
      className="space-y-3 border-t border-line px-5 py-4"
    >
      <SkeletonBlock className="h-4 w-20" />
      <SkeletonBlock className="h-4 w-32" />
      <SkeletonBlock className="h-4 w-20" />
      <SkeletonBlock className="h-4 w-32" />
    </div>
  );
};

const GroupPickerCard = ({
  groups,
  isPending,
  isError,
  loadError,
  onRetry,
  value,
  onChange,
  error,
  errorKey,
}) => {
  return (
    <Card
      id="group-picker"
      role="radiogroup"
      aria-labelledby="group-title"
      aria-describedby={error ? "group-error" : undefined}
    >
      <div className="px-5 pb-3 pt-4">
        <SectionTitle id="group-title">
          PILIH GROUP<span className="text-danger">*</span>
        </SectionTitle>
        <HelperText className="mt-1">
          Pilih salah satu opsi dibawah ini
        </HelperText>
        <FieldError key={errorKey} id="group-error" message={error} />
      </div>

      {isPending ? (
        <GroupSkeleton />
      ) : isError ? (
        <div className="border-t border-line">
          <QueryError message={loadError} onRetry={onRetry} />
        </div>
      ) : groups.length === 0 ? (
        <p className="border-t border-line px-5 py-4 text-center text-xs text-gray-500">
          Belum ada group yang tersedia. Hubungi penyelenggara.
        </p>
      ) : (
        buildSections(groups).map((s) => (
          <GroupSection
            key={s.title}
            title={s.title}
            options={s.options}
            name="group"
            value={value}
            onChange={onChange}
          />
        ))
      )}
    </Card>
  );
};

export default GroupPickerCard;
