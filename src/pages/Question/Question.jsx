import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useQuestionStore from "../../store/zustand";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";

function Question() {
  const { fetchQuestion, question: questionData } = useQuestionStore();
  const { search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!questionData || questionData.length === 0) {
      fetchQuestion(search)
        .then(() => {
          console.log("Questions fetched successfully");
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
        });
    }
  }, [search, questionData, fetchQuestion]);

  if (!questionData || questionData.length === 0) return <p>Loading...</p>;

  const firstQuestion = questionData[0] || {};

  return (
    <AnimateProvider className="max-w-xl mx-auto">
      <h1 className="text-base md:text-lg font-semibold mb-5 text-orange-900">
        Quiz Info
      </h1>

      <div className="flex flex-col text-gray-900 space-y-3 text-xs md:text-sm">
        <div className="flex space-x-5">
          <p className="min-w-[170px]">Number of questions</p>
          <p className="font-bold">{questionData.length}</p>
        </div>

        <div className="flex space-x-5">
          <p className="min-w-[170px]">Category</p>
          <p className="font-bold text-orange-500">
            {firstQuestion.category || "N/A"}
          </p>
        </div>

        <div className="flex space-x-5">
          <p className="min-w-[170px]">Difficulty</p>
          <p className="font-bold capitalize text-lime-600">
            {firstQuestion.difficulty || "N/A"}
          </p>
        </div>

        <div className="flex space-x-5">
          <p className="min-w-[170px]">Time</p>
          <p className="font-bold">10 mins.</p>
        </div>
      </div>

      <button
        disabled={!questionData.length}
        onClick={() => navigate(`/question/1`)}
        className="flex w-full rounded-full bg-orange-500 cursor-pointer disabled:bg-orange-500/50 disabled:cursor-not-allowed p-1 justify-center font-semibold md:font-bold text-base md:text-lg text-center mt-10 text-white hover:bg-neutral-50 hover:text-orange-500 transition"
      >
        Start
      </button>
    </AnimateProvider>
  );
}

export default Question;