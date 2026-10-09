import { Navigate, Outlet, useOutletContext } from "react-router";
import useSession from "@hooks/useSession";

// Layout route penjaga: tanpa sesi, kembali ke landing.
// Context dari RootLayout harus diteruskan ke halaman di bawahnya.
const RequireSession = () => {
  const { session } = useSession();
  const context = useOutletContext();

  if (!session) return <Navigate to="/" replace />;
  return <Outlet context={context} />;
};

export default RequireSession;
