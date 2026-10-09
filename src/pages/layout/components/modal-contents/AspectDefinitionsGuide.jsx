import { ASPEK } from "@/data/aspek";

// Isi modal "Definisi Tiap Aspek". Daftar diambil dari data aspek,
// jadi mengubah label atau deskripsi cukup dilakukan di src/data/aspek.js.
const AspectDefinitionsGuide = () => {
  return (
    <dl className="space-y-3">
      {ASPEK.map((a) => (
        <div key={a.key}>
          <dt className="font-semibold">{a.label}</dt>
          <dd className="text-gray-600">{a.desc}</dd>
        </div>
      ))}
    </dl>
  );
};

export default AspectDefinitionsGuide;