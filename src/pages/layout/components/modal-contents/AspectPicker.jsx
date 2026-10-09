import { ASPEK } from "@/data/aspek";

// Isi modal "Pilih Aspek". `taken` = key aspek yang sudah dipilih (dinonaktifkan).
const AspectPicker = ({ taken, onPick }) => {
  return (
    <ul className="divide-y divide-line">
      {ASPEK.map((a) => (
        <li key={a.key}>
          <button
            type="button"
            disabled={taken.includes(a.key)}
            onClick={() => onPick(a.key)}
            className="w-full py-2.5 text-left hover:bg-gray-50 disabled:text-gray-400"
          >
            {a.label}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default AspectPicker;