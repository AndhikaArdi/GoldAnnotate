import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60_000,
  headers: {
    "Content-Type": "application/json",
  },
});

const FALLBACK_MESSAGES = {
  NETWORK_ERROR:
    "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
  TIMEOUT: "Server terlalu lama merespons. Coba lagi.",
  UNKNOWN_ERROR: "Terjadi kesalahan yang tidak terduga.",
};

const fallbackCode = (error) => {
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT")
    return "TIMEOUT";
  return error.response ? "UNKNOWN_ERROR" : "NETWORK_ERROR";
};

// Semua error diseragamkan: { message, status, code, details }
// - dari server : mengikuti format error di kontrak
// - tanpa respons: code NETWORK_ERROR atau TIMEOUT
const toApiError = (error) => {
  const body = error.response?.data?.error;
  const code = body?.code ?? fallbackCode(error);
  const apiError = new Error(
    body?.message ?? FALLBACK_MESSAGES[code] ?? FALLBACK_MESSAGES.UNKNOWN_ERROR,
  );
  apiError.status = error.response?.status ?? null;
  apiError.code = code;
  apiError.details = body?.details ?? {};
  return apiError;
};

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(axios.isCancel(error) ? error : toApiError(error)),
);

export default api;
