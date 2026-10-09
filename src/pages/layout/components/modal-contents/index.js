import ChooseGroupGuide from "./ChooseGroupGuide";
import AnswerGuide from "./AnswerGuide";
import AspectDefinitionsGuide from "./AspectDefinitionsGuide";

// Satu entri = satu modal panduan.
// title   : tampil di daftar GuideCard dan sebagai judul modal.
// Content : komponen isi modal.
// Urutan di sini = urutan baris di GuideCard.
export const GUIDES = {
  group: { title: "Cara Memilih Group", Content: ChooseGroupGuide },
  jawab: { title: "Cara Mengisi Jawaban", Content: AnswerGuide },
  aspek: { title: "Definisi Tiap Aspek", Content: AspectDefinitionsGuide },
};

export { default as AspectPicker } from "./AspectPicker";