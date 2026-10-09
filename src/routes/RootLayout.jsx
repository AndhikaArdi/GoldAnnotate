import { useState } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import { Toaster } from "react-hot-toast";
import PageLayout from "@pages/layout/PageLayout";
import Modal from "@components/Modal";
import { GUIDES, AspectPicker } from "@components/modal-contents";
import useAnnotation from "@hooks/useAnnotation";
import { TOASTER_OPTIONS } from "@helpers/notify";

import useSession from "@hooks/useSession";
import OfflineBanner from "@components/OfflineBanner";

// SEMENTARA: annotation masih disimpan di sini (pindah ke server di Langkah 13).
const RootLayout = () => {
  const [modal, setModal] = useState(null); // { type: 'guide', key } | { type: 'aspect', questionId }

  const { session } = useSession();
  const annotation = useAnnotation(session?.submissionId);

  const closeModal = () => setModal(null);
  const openGuide = (key) => setModal({ type: "guide", key });
  const openAspectPicker = (questionId) =>
    setModal({ type: "aspect", questionId });

  const guide = modal?.type === "guide" ? GUIDES[modal.key] : null;

  return (
    <>
      <OfflineBanner />

      <PageLayout>
        <Outlet context={{ annotation, openGuide, openAspectPicker }} />
      </PageLayout>

      {guide && (
        <Modal
          title={guide.title}
          onClose={closeModal}
          confirmLabel="Saya Mengerti"
        >
          <guide.Content />
        </Modal>
      )}

      {modal?.type === "aspect" && (
        <Modal title="Pilih Aspek" onClose={closeModal}>
          <AspectPicker
            taken={annotation.get(modal.questionId).aspects.map((a) => a.key)}
            onPick={(key) => {
              annotation.addAspect(modal.questionId, key);
              closeModal();
            }}
          />
        </Modal>
      )}

      <Toaster position="top-center" toastOptions={TOASTER_OPTIONS} />
      <ScrollRestoration />
    </>
  );
};

export default RootLayout;