import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import Button from "@components/Button";
import IdentityCard from "@components/IdentityCard";
import GuideCard from "@components/GuideCard";
import GroupPickerCard from "@components/GroupPickerCard";
import useSession from "@hooks/useSession";
import useSwitchGroup from "@hooks/useSwitchGroup";
import { useGroups } from "@hooks/useGoldsetData";
import { useCreateSubmission } from "@hooks/useGoldsetMutations";
import {
  FIELD_ORDER,
  formatName,
  normalizeEmail,
  validateLanding,
} from "@helpers/form";
import { toastError } from "@helpers/notify";

// `group` di form berisi id group (misalnya "overlap"), bukan labelnya.
const EMPTY_FORM = { email: "", nama: "", group: "" };

// id elemen yang dituju saat field bermasalah.
const SCROLL_TARGET = { email: "email", nama: "nama", group: "group-picker" };

const scrollToField = (field) => {
  const el = document.getElementById(SCROLL_TARGET[field]);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  // Field teks langsung difokuskan. Kartu group cukup di-scroll.
  if (field !== "group") el.focus({ preventScroll: true });
};

const PageFooter = () => {
  return (
    <footer className="space-y-1 pb-4 pt-6 text-center text-xs text-gray-500">
      <p>Form ini dibuat oleh Andhika Ardi sebagai clone dari Google form</p>
      <p>Untuk keperluan mata kuliah Tugas Akhir</p>
      <p className="pt-2 text-base font-medium text-gray-400">
        Goldset Formulir
      </p>
    </footer>
  );
};

const LandingPage = () => {
  const { openGuide, annotation } = useOutletContext();
  const { session, startSession } = useSession();
  const navigate = useNavigate();
  const groupsQuery = useGroups();
  const createSubmission = useCreateSubmission();
  const switchGroup = useSwitchGroup(annotation);

  // Form hanyalah draf. Jika sesi sudah ada, isi awalnya diambil dari sesi.
  const [form, setForm] = useState(() =>
    session
      ? { email: session.email, nama: session.nama, group: session.groupId }
      : EMPTY_FORM,
  );
  const [errors, setErrors] = useState({});
  // Naik setiap kali "Mulai Kuis" gagal validasi, supaya animasi highlight diputar ulang.
  const [errorKey, setErrorKey] = useState(0);
  // true selama proses pindah group (hitung jawaban, konfirmasi, hapus).
  const [isSwitching, setIsSwitching] = useState(false);

  const isBusy = isSwitching || createSubmission.isPending;

  const getGroupLabel = (id) =>
    groupsQuery.data?.find((g) => g.id === id)?.label ?? id;

  const updateForm = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    // Error field ini hilang begitu pengguna mengubahnya.
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  // Rapikan isi field saat kursor meninggalkannya.
  const handleBlur = (field) => {
    if (field === "email") {
      setForm((f) => ({ ...f, email: normalizeEmail(f.email) }));
    }
    if (field === "nama") {
      setForm((f) => ({ ...f, nama: formatName(f.nama) }));
    }
  };

  const handleStart = async () => {
    const cleaned = {
      ...form,
      email: normalizeEmail(form.email),
      nama: formatName(form.nama),
    };
    setForm(cleaned);

    const found = validateLanding(cleaned);
    setErrors(found);

    const firstInvalid = FIELD_ORDER.find((field) => found[field]);
    if (firstInvalid) {
      setErrorKey((k) => k + 1);
      scrollToField(firstInvalid);
      return;
    }

    // Email sama tetapi group berbeda dari sesi berjalan = pindah group (jawaban lama direset).
    // Email berbeda dianggap annotator lain, jadi progres sesi sebelumnya tidak disentuh.
    const shouldSwitch =
      session?.submissionId &&
      session.email === cleaned.email &&
      session.groupId !== cleaned.group;

    if (shouldSwitch) {
      setIsSwitching(true);
      try {
        const result = await switchGroup(session, getGroupLabel(cleaned.group));
        // Batal: pilihan kembali ke group lama.
        if (result === "cancel") {
          setForm((f) => ({ ...f, group: session.groupId }));
        }
        if (result !== "ok") return;
      } finally {
        setIsSwitching(false);
      }
    }

    createSubmission.mutate(
      { email: cleaned.email, nama: cleaned.nama, groupId: cleaned.group },
      {
        // Data sesi diambil dari respons server (sumber kebenaran).
        onSuccess: (submission) => {
          startSession({
            email: submission.email,
            nama: submission.nama,
            groupId: submission.group.id,
            groupLabel: submission.group.label,
            submissionId: submission.id,
          });
          navigate("/kuis/1");
        },
        onError: (error) => {
          toastError(`Gagal memulai kuis: ${error.message}`, {
            id: "start-error",
          });
        },
      },
    );
  };

  const handleReset = () => {
    setErrors({});
    setForm(EMPTY_FORM);
  };

  return (
    <>
      <IdentityCard
        email={form.email}
        nama={form.nama}
        errors={errors}
        errorKey={errorKey}
        onChange={updateForm}
        onBlur={handleBlur}
      />
      <GuideCard onOpen={openGuide} />
      <GroupPickerCard
        groups={groupsQuery.data ?? []}
        isPending={groupsQuery.isPending}
        isError={groupsQuery.isError}
        loadError={groupsQuery.error?.message}
        onRetry={() => groupsQuery.refetch()}
        value={form.group}
        onChange={(id) => updateForm("group", id)}
        error={errors.group}
        errorKey={errorKey}
      />

      <div className="flex items-center justify-between">
        <Button variant="danger" onClick={handleReset} disabled={isBusy}>
          Kosongkan Formulir
        </Button>
        <Button onClick={handleStart} loading={isBusy}>
          Mulai Kuis
        </Button>
      </div>

      <PageFooter />
    </>
  );
};

export default LandingPage;