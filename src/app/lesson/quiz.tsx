"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useWindowSize } from "react-use";
import ReactConfetti from "react-confetti";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import Header from "./header";
import Footer from "./footer";
import Challenge from "./challenge";
import ResultCard from "./result-card";
import QuestionBubble from "./question-bubble";

import { reduceHearts } from "@/server/actions/user-progress";
import { challengeOptions, challenges } from "@/server/db/schema";
import { upsertChallengeProgress } from "@/server/actions/challenge-progress";

type QuizProps = {
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  initialHearts: number;
  initialPercentage: number;
};

const Quiz = ({
  initialLessonId,
  initialLessonChallenges,
  initialHearts,
  initialPercentage,
}: QuizProps) => {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [pending, startTransition] = useTransition();

  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const incorrectAudioRef = useRef<HTMLAudioElement | null>(null);
  const finishAudioRef = useRef<HTMLAudioElement | null>(null);

  const [lessonId] = useState<number>(initialLessonId);
  const [hearts, setHearts] = useState<number>(initialHearts);

  const [percentage, setPercentage] = useState<number>(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });

  const [challenges] = useState(initialLessonChallenges);

  const [activeIndex, setActiveIndex] = useState(() => {
    const uncompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );

    return uncompletedIndex === -1 ? 0 : uncompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  const currentChallenge = challenges[activeIndex];
  const options = currentChallenge?.challengeOptions ?? [];

  const title =
    currentChallenge?.type === "ASSIST"
      ? "Select the correct meaning"
      : currentChallenge?.question;

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onSelect = (id: number) => {
    if (status !== "none") return;
    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);

    if (!correctOption) {
      return;
    }

    if (correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(currentChallenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              // TODO: open hearts modal
              return;
            }

            if (correctAudioRef.current) {
              correctAudioRef.current.play();
            }

            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

            // this is a practice challenge
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    } else {
      startTransition(() => {
        reduceHearts(currentChallenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              // TODO: open hearts modal
              return;
            }

            if (incorrectAudioRef.current) {
              incorrectAudioRef.current.play();
            }

            setStatus("wrong");

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again."));
      });
    }
  };

  if (!currentChallenge) {
    return (
      <>
        <audio ref={finishAudioRef} src="/finish.mp3" autoPlay />

        <ReactConfetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
        />

        <div className="flex flex-col items-center justify-center h-full gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center">
          <Image
            src="/finish.svg"
            alt="Finish"
            height={100}
            width={100}
            className="hidden lg:block"
          />

          <Image
            src="/finish.svg"
            alt="Finish"
            height={50}
            width={50}
            className="block lg:hidden"
          />

          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
            Great job! <br /> You&apos;ve completed the lesson.
          </h1>

          <div className="flex items-center gap-x-4 w-full">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>

        <Footer
          onCheck={() => router.push("/learn")}
          status="completed"
          lessonId={lessonId}
        />
      </>
    );
  }

  return (
    <>
      <audio ref={correctAudioRef} src="/correct.wav" />
      <audio ref={incorrectAudioRef} src="/incorrect.wav" />

      <Header hearts={hearts} percentage={percentage} />

      <div className="flex-1">
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col w-full gap-y-12 md:min-h-[350px] md:w-[600px] px-6 md:px-0">
            <h1 className="text-lg lg:text-3xl lg:text-start self-center font-bold text-neutral-700">
              {title}
            </h1>

            <div>
              {currentChallenge.type === "ASSIST" && (
                <QuestionBubble question={currentChallenge.question} />
              )}

              <Challenge
                options={options}
                onSelect={onSelect}
                status={status}
                disabled={pending}
                selectedOption={selectedOption}
                type={currentChallenge.type}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer
        onCheck={onContinue}
        status={status}
        disabled={pending || !selectedOption}
      />
    </>
  );
};

export default Quiz;
