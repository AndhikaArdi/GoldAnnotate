export const ASPEK = [
  {
    key: "lokasi_aksesibilitas",
    label: "Aksesibilitas Lokasi",
    desc: "Kemudahan menemukan dan mengakses gedung kantor pos.",
  },
  {
    key: "fasilitas_parkir",
    label: "Fasilitas Parkir",
    desc: "Ketersediaan dan pengelolaan area parkir.",
  },
  {
    key: "lingkungan_gedung_fasilitas_fisik",
    label: "Fasilitas Gedung Ruang dan Lingkungan",
    desc: "Kondisi fisik bangunan dan kenyamanan ruang tunggu.",
  },
  {
    key: "jam_operasional",
    label: "Hari & Jam Operasional",
    desc: "Kesesuaian waktu buka-tutup layanan dengan jadwal resmi.",
  },
  {
    key: "waktu_tunggu_antrean",
    label: "Waktu Tunggu & Sistem Antrean",
    desc: "Lama dan kelancaran proses antre sebelum dilayani.",
  },
  {
    key: "pelayanan_petugas_staf",
    label: "Pelayanan Petugas & Staf (Offline)",
    desc: "Sikap dan kompetensi petugas dalam melayani secara langsung.",
  },
  {
    key: "pengiriman_kurir",
    label: "Kualitas Pengiriman & Kurir",
    desc: "Keandalan proses pengiriman barang/surat hingga sampai tujuan.",
  },
  {
    key: "layanan_keuangan_nonlogistik",
    label: "Layanan Keuangan & Non-Logistik",
    desc: "Layanan kantor pos di luar pengiriman barang.",
  },
  {
    key: "layanan_kontak_pengaduan",
    label: "Layanan Kontak & Pengaduan Jarak Jauh",
    desc: "Responsivitas kanal komunikasi resmi di luar kunjungan langsung.",
  },
  {
    key: "tarif_biaya_admin",
    label: "Kesesuaian Tarif & Biaya Admin",
    desc: "Persepsi kewajaran harga terhadap layanan yang diterima.",
  },
  {
    key: "lainnya",
    label: "Lainnya",
    desc: "Aspek relevan yang tidak tercakup 10 aspek lain (bukan untuk review non-informatif).",
  },
];

export const getAspekLabel = (key) =>
  ASPEK.find((a) => a.key === key)?.label ?? key;
