import { useSyncExternalStore } from "react";
import { getSession, setSession, subscribeSession } from "@helpers/session";

// Dipakai nanti: updateSession di Langkah 9 (mengisi submissionId),
// endSession di Langkah 15 (setelah submission selesai).
const startSession = (session) => setSession(session);

const updateSession = (patch) => {
  const current = getSession();
  if (current) setSession({ ...current, ...patch });
};

const endSession = () => setSession(null);

const useSession = () => {
  const session = useSyncExternalStore(subscribeSession, getSession);
  return { session, startSession, updateSession, endSession };
};

export default useSession;
