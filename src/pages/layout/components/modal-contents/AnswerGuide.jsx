// Isi modal "Cara Mengisi Jawaban".
const AnswerGuide = () => {
  return (
    <ol className="list-decimal space-y-2 pl-5">
      <li>Baca ulasan dan lihat rating bintangnya.</li>
      <li>
        Klik <b>+ Tambah Aspek</b>, lalu pilih aspek yang dibahas.
      </li>
      <li>Tentukan sentimen tiap aspek: Positif, Netral, atau Negatif.</li>
      <li>
        Jika tidak ada aspek yang dibahas, centang <b>Tidak Ada Aspek</b>.
      </li>
    </ol>
  );
};

export default AnswerGuide;