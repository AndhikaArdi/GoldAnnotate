import { useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";

import NotFoundPage from "@pages/not-found";

import Button from "@components/Button";
import Card from "@components/Card";
import GuideCard from "@components/GuideCard";
import { QueryError, SkeletonBlock } from "@components/LoadingStates";
import ProgressStepper from "@components/ProgressStepper";
import QuestionCard from "@components/QuestionCard";
import QuizHeaderCard from "@components/QuizHeaderCard";
import SaveStatus from "@components/SaveStatus";

import useFinishQuiz from "@hooks/useFinishQuiz";
import useQuizQuestions from "@hooks/useQuizQuestions";
import useSession from "@hooks/useSession";

import { isAnswerDone } from "@helpers/answer";
import { toastError } from "@helpers/notify";
import { parsePageParam } from "@helpers/page";
import { PAGE_SIZE, getPageQuestions } from "@helpers/questions";

const QuizSkeleton = () => {
  return (
    <div role="status" aria-label="Memuat soal" className="space-y-3">
      <Card className="px-5 py-4">
        <SkeletonBlock className="h-3 w-24" />
        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: 10 }, (_, i) => (
            <SkeletonBlock key={i} className="h-7 w-7 rounded-full" />
          ))}
        </div>
      </Card>
      {[0, 1, 2].map((i) => (
        <Card key={i} className="space-y-3 p-5">
          <SkeletonBlock className="h-4 w-1/3" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-4/5" />
          <SkeletonBlock className="h-16 w-full" />
        </Card>
      ))}
    </div>
  );
};

// Header dan panduan: sama di semua keadaan (memuat, gagal, kosong, normal).
const QuizHeader = ({ session, onOpenGuide }) => {
  return (
    <>
      <QuizHeaderCard
        group={session.groupLabel}
        email={session.email}
        nama={session.nama}
      />
      <GuideCard onOpen={onOpenGuide} />
    </>
  );
};

const QuizPage = () => {
  const { annotation, openGuide, openAspectPicker } = useOutletContext();
  const { session, endSession } = useSession();
  const { halaman } = useParams();
  const navigate = useNavigate();
  const { query, questions, totalPages } = useQuizQuestions(
    session.groupId,
    session.email,
  );
  const answersQuery = annotation.query;

  const sessionGone = answersQuery.error?.code === "SUBMISSION_NOT_FOUND";
  useEffect(() => {
    if (!sessionGone) return;
    endSession();
    toastError("Sesi Anda tidak ditemukan di server. Silakan mulai lagi.", {
      id: "session-gone",
    });
  }, [sessionGone, endSession]);

  const { finish, isFinishing } = useFinishQuiz({
    session,
    questions,
    annotation,
  });

  // Semua hook ada di atas. Di bawah ini hanya return bersyarat.
  // Soal dan jawaban lama harus siap dulu, supaya jawaban yang sudah tersimpan tidak tertimpa kondisi kosong.
  if (query.isPending || answersQuery.isPending) {
    return (
      <>
        <QuizHeader session={session} onOpenGuide={openGuide} />
        <QuizSkeleton />
      </>
    );
  }

  if (query.isError || answersQuery.isError) {
    const failedQuery = query.isError ? query : answersQuery;
    return (
      <>
        <QuizHeader session={session} onOpenGuide={openGuide} />
        <Card>
          <QueryError
            message={failedQuery.error?.message}
            onRetry={() => failedQuery.refetch()}
          />
        </Card>
      </>
    );
  }

  if (questions.length === 0) {
    return (
      <>
        <QuizHeader session={session} onOpenGuide={openGuide} />
        <Card className="px-5 py-6 text-center">
          Group ini belum memiliki soal.
        </Card>
      </>
    );
  }

  const page = parsePageParam(halaman, totalPages);
  if (page === null) return <NotFoundPage />;

  const goToPage = (p) => {
    const target = Math.min(Math.max(p, 1), totalPages);
    if (target !== page) navigate(`/kuis/${target}`);
  };

  const isPageDone = (p) =>
    getPageQuestions(questions, p).every((q) =>
      isAnswerDone(annotation.get(q.reviewid)),
    );

  const pageQuestions = getPageQuestions(questions, page);
  const firstNumber = (page - 1) * PAGE_SIZE; // nomor soal global (halaman 2 mulai dari 11)

  return (
    <>
      <QuizHeader session={session} onOpenGuide={openGuide} />

      <ProgressStepper
        total={totalPages}
        current={page}
        isDone={isPageDone}
        onSelect={goToPage}
      />

      <SaveStatus
        pending={annotation.save.pending}
        failed={annotation.save.failed}
        onRetry={annotation.save.retry}
      />

      {pageQuestions.map((review, i) => (
        <QuestionCard
          key={review.reviewid}
          id={review.reviewid}
          index={firstNumber + i}
          review={review}
          answer={annotation.get(review.reviewid)}
          onToggleNone={(checked) =>
            annotation.toggleNone(review.reviewid, checked)
          }
          onAdd={() => openAspectPicker(review.reviewid)}
          onRemove={(key) => annotation.removeAspect(review.reviewid, key)}
          onSentiment={(key, s) =>
            annotation.setSentiment(review.reviewid, key, s)
          }
        />
      ))}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className={page === 1 ? "invisible" : ""}
          onClick={() => goToPage(page - 1)}
        >
          Kembali
        </Button>
        
        {page === totalPages ? (
          <Button onClick={finish} loading={isFinishing}>
            Selesai
          </Button>
        ) : (
          <Button onClick={() => goToPage(page + 1)}>Berikutnya</Button>
        )}
      </div>
    </>
  );
};

export default QuizPage;