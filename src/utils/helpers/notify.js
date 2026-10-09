import Swal from "sweetalert2";
import toast from "react-hot-toast";

// Semua notifikasi lewat file ini supaya tampilannya seragam.
// Warna sama dengan @theme di src/App.css.
const BRAND = "#5746E3";
const DANGER = "#DA372C";
const SUCCESS = "#16A34A"; // sama dengan hijau "selesai" di stepper

const baseButton = "rounded-md px-5 py-2 text-sm font-medium";
const buttonClass = {
  primary: `${baseButton} bg-brand text-white hover:bg-brand-dark`,
  danger: `${baseButton} bg-danger text-white hover:bg-red-700`,
  cancel: `${baseButton} border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`,
};

// ---------- SweetAlert2 ----------
// Gaya popup (sudut, judul, latar) ada di src/App.css, kelas .goldset-swal.
const showDialog = ({
  title,
  text,
  html,
  icon,
  variant = "primary",
  confirmText,
  cancelText,
  showCancel,
}) =>
  Swal.fire({
    title,
    text,
    html,
    icon,
    iconColor: variant === "danger" ? DANGER : BRAND,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    showCancelButton: showCancel,
    reverseButtons: true, // Batal di kiri, konfirmasi di kanan
    focusCancel: variant === "danger", // tindakan berbahaya: fokus awal di Batal
    buttonsStyling: false,
    customClass: {
      popup: "goldset-swal",
      confirmButton: buttonClass[variant],
      cancelButton: buttonClass.cancel,
    },
  });

// Mengembalikan true jika pengguna menekan tombol konfirmasi.
// Esc, klik di luar popup, dan Batal mengembalikan false.
// `html` hanya untuk teks buatan sendiri; jangan masukkan teks dari pengguna.
export const confirmDialog = async ({
  confirmText = "Ya",
  cancelText = "Batal",
  ...options
}) => {
  const result = await showDialog({
    ...options,
    confirmText,
    cancelText,
    showCancel: true,
  });
  return result.isConfirmed;
};

// Pemberitahuan dengan satu tombol.
export const alertDialog = async ({ confirmText = "Mengerti", ...options }) => {
  await showDialog({ ...options, confirmText, showCancel: false });
};

// ---------- Toast (react-hot-toast) ----------
// Beri `{ id: "nama-unik" }` pada options agar toast yang sama tidak menumpuk.
export const toastSuccess = (message, options) => toast.success(message, options);
export const toastError = (message, options) => toast.error(message, options);

// Dipasang sekali di RootLayout: <Toaster position="top-center" toastOptions={TOASTER_OPTIONS} />
export const TOASTER_OPTIONS = {
  duration: 3500,
  style: {
    borderRadius: "10px",
    border: "1px solid #F3F3F3",
    background: "#FFFFFF",
    color: "#1F2937",
    fontSize: "14px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  },
  success: { iconTheme: { primary: SUCCESS, secondary: "#FFFFFF" } },
  error: {
    duration: 5000,
    iconTheme: { primary: DANGER, secondary: "#FFFFFF" },
  },
};