// Antrean simpan per soal.
// - Satu permintaan berjalan per soal (kunci), jadi hasil lama tidak bisa menimpa hasil baru.
// - Jika ada perubahan baru saat permintaan masih berjalan, hanya yang terbaru dikirim setelahnya.
// - Yang gagal diingat supaya bisa dicoba lagi.
// - discard(awalan) membuang semua yang terkait submission yang sudah dihapus.
// save(payload) harus mengembalikan promise.
// onChange({ pending, failed }) dipanggil setiap status berubah.
export const createSaveQueue = (save, onChange) => {
  const running = new Set(); // kunci yang sedang dikirim
  const waiting = new Map(); // kunci -> perubahan terbaru yang menunggu
  const failed = new Map(); // kunci -> perubahan yang gagal dikirim
  const discarded = new Set(); // awalan kunci (submission) yang sudah dibuang

  const isDiscarded = (key) =>
    [...discarded].some((prefix) => key.startsWith(prefix));

  const notify = () =>
    onChange({
      pending: new Set([...running, ...waiting.keys()]).size,
      failed: failed.size,
    });

  const run = async (key, payload) => {
    running.add(key);
    notify();

    try {
      await save(payload);
      failed.delete(key);
    } catch {
      // Kegagalan milik submission yang sudah dibuang tidak perlu diingat.
      if (!isDiscarded(key)) failed.set(key, payload);
    } finally {
      running.delete(key);
    }

    if (waiting.has(key)) {
      const latest = waiting.get(key);
      waiting.delete(key);
      if (!isDiscarded(key)) {
        await run(key, latest);
        return;
      }
    }
    notify();
  };

  const enqueue = (key, payload) => {
    failed.delete(key); // perubahan baru menggantikan percobaan yang gagal
    if (running.has(key)) {
      waiting.set(key, payload);
      notify();
    } else {
      run(key, payload);
    }
  };

  const retryFailed = () => {
    [...failed].forEach(([key, payload]) => enqueue(key, payload));
  };

  // Contoh awalan: "id-submission:" (semua soal milik submission itu).
  const discard = (prefix) => {
    discarded.add(prefix);
    [...failed.keys()]
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => failed.delete(key));
    [...waiting.keys()]
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => waiting.delete(key));
    notify();
  };

  return { enqueue, retryFailed, discard };
};