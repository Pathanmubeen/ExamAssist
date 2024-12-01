import { useLocation, useNavigate } from "react-router-dom";
import useQuestionStore from "../../store/zustand";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";
import { useEffect } from "react";

function Success() {
  const {
    trueAnswer,
    falseAnswer,
    resetQuestion,
    setTimeStamp,
    question: allQuestion,
    userAnswer = [], // Default to an empty array if userAnswer is undefined
  } = useQuestionStore();

  const navigate = useNavigate();
  const location = useLocation();
  const { questionTimes } = location.state || {}; // Retrieve questionTimes passed from SingleQuestion

  const totalQuestions = allQuestion.length;
  const score = (trueAnswer * 100) / totalQuestions;
  const indxColor =
    score >= 80 ? "#10b981" : score >= 60 ? "#F59E0B" : "#dc2626";

  useEffect(() => {
    setTimeStamp(0);
  }, []);

  const handleClick = () => {
    resetQuestion();
    navigate("/"); // This will navigate to the home page/dashboard
  };

  return (
    <AnimateProvider className="flex flex-col space-y-10 md:max-w-xl md:mx-auto">
      <h3 className="text-lg text-center text-neutral-900 font-bold md:text-xl">
        Your Final score is
      </h3>

      <h1
        style={{
          background: indxColor,
        }}
        className={`text-5xl font-bold mx-auto p-5 rounded-full md:text-6xl text-neutral-100`}
      >
        {score}
      </h1>

      <div className="text-xs md:text-sm text-neutral-600 font-medium flex flex-col space-y-1">
        <p className="flex justify-between">
          Correct Answer <span className="text-green-600">{trueAnswer}</span>
        </p>
        <p className="flex justify-between">
          Wrong Answer <span className="text-red-600">{falseAnswer}</span>
        </p>
        <p className="flex justify-between">
          Answer Submitted{" "}
          <span className="text-purple-600">{trueAnswer + falseAnswer}</span>
        </p>
      </div>

      <button
        onClick={handleClick}
        className="bg-orange-500 text-white font-bold p-2 rounded-full py-2 hover:bg-neutral-50 hover:text-orange-500 transition"
      >
        Back to dashboard
      </button>

      <h3 className="text-center text-neutral-600 font-semibold md:text-lg pt-[40px] pb-4">
        Answer Summary
      </h3>

      {userAnswer.length > 0 ? (
        userAnswer.map((answerItem, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between text-neutral-800 font-semibold">
                <span>Question:</span>
                <span className="font-normal">{answerItem.question?.question}</span>
              </div>

              <div className="flex justify-between text-neutral-800 font-semibold">
                <span>Your answer:</span>
                <span className="font-normal">{answerItem.answer}</span>
              </div>

              <div className="flex justify-between text-neutral-800 font-semibold">
                <span>Correct answer:</span>
                <span className="font-normal">{answerItem.question?.correct_answer}</span>
              </div>

              <div
                className={`text-xl font-semibold ${
                  answerItem.isCorrect ? "text-green-500" : "text-red-500"
                }`}
              >
                {answerItem.isCorrect ? "Correct" : "Incorrect"}
              </div>

              {/* Time Taken */}
              <div className="flex justify-between text-neutral-800 font-semibold">
                <span>Time Taken:</span>
                <span className="font-normal">
                  {questionTimes[index]
                    ? `${Math.floor(questionTimes[index] / 60)}:${String(
                        questionTimes[index] % 60
                      ).padStart(2, "0")}`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No answers submitted yet.</p>
      )}
    </AnimateProvider>
  );
}

export default Success;
