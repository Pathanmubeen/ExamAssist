import useQuestionStore from "../../store/zustand";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimateProvider from "../../components/AnimateProvider/AnimateProvider";

function SingleQuestion() {
  const { question: SingleQuestion, addAnswer } = useQuestionStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // To track user's answers
  const [timeRemaining, setTimeRemaining] = useState(600); // Main quiz timer in seconds
  const [extraTimeAdded, setExtraTimeAdded] = useState(false); // To track if extra time was added
  const [questionTimers, setQuestionTimers] = useState({}); // Per-question timer state
  const [questionTimes, setQuestionTimes] = useState({}); // Track time for each question
  const navigate = useNavigate();

  const handleClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleAnswer = (selectedOption) => {
  const currentQuestion = SingleQuestion[currentQuestionIndex];

  // Update the answer tracking state, always overwrite the answer for the current question
  setAnswers((prev) => ({
    ...prev,
    [currentQuestionIndex]: selectedOption,
  }));

  // Store the answer in Zustand, updating with the most recent selection
  addAnswer({
    question: currentQuestion,
    answer: selectedOption,
  });

  // Stop the timer and record the time for this question (only if it's the first answer)
  const elapsedTime = questionTimers[currentQuestionIndex] || 0;
  setQuestionTimes((prev) => ({
    ...prev,
    [currentQuestionIndex]: elapsedTime,
  }));
};


  const handleFinish = () => {
    navigate("/success", { state: { questionTimes } }); // Pass questionTimes to Success page
  };

  const currentQuestion = SingleQuestion?.[currentQuestionIndex];
  const allAttempted = Object.keys(answers).length === SingleQuestion.length;

  // Timer countdown effect for the main quiz
  useEffect(() => {
    if (timeRemaining === 0) {
      handleFinish(); // Automatically finish the quiz when time is up
      return;
    }

    const mainTimerInterval = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(mainTimerInterval); // Cleanup on unmount or timer reach 0
  }, [timeRemaining]);

  // Timer countdown effect for the current question
  useEffect(() => {
    const questionKey = currentQuestionIndex;
    if (!SingleQuestion || SingleQuestion.length === 0) return;

    const interval = setInterval(() => {
      setQuestionTimers((prev) => ({
        ...prev,
        [questionKey]: (prev[questionKey] || 0) + 1,
      }));
    }, 1000);

    return () => clearInterval(interval); // Clear timer when moving away from the question
  }, [currentQuestionIndex, SingleQuestion]);

  // Handle adding extra time
  const handleAddExtraTime = () => {
    if (timeRemaining <= 120 && !extraTimeAdded) {
      setTimeRemaining((prev) => prev + 300); // Add 3 minutes (180 seconds)
      setExtraTimeAdded(true); // Prevent adding extra time again
    }
  };

  // Convert timeRemaining to minutes and seconds
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  // Per-question elapsed time
  const questionElapsedTime = questionTimers[currentQuestionIndex] || 0;
  const questionMinutes = Math.floor(questionElapsedTime / 60);
  const questionSeconds = questionElapsedTime % 60;

  // Show the "Add Extra Time" button if there's less than 30 seconds
  const showAddExtraTimeButton = timeRemaining <= 30 && !extraTimeAdded;

  if (!SingleQuestion || SingleQuestion.length === 0) {
    return <p>Loading questions...</p>;
  }

  return (
    <AnimateProvider className="max-w-4xl mx-auto p-5">
      <h1 className="text-lg font-semibold mb-5 text-orange-900">Exam Questions</h1>

      {/* Timer Display */}
      <div className="text-center text-xl font-bold mb-5">
        Time Remaining: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>

      {/* Question Timer */}
      <div className="text-center text-lg font-medium mb-5 text-blue-600">
        Time Spent on This Question: {questionMinutes}:
        {questionSeconds < 10 ? `0${questionSeconds}` : questionSeconds}
      </div>

      {/* Show Add Extra Time Button */}
      {showAddExtraTimeButton && (
        <div className="text-center mb-5">
          <button
            onClick={handleAddExtraTime}
            className="bg-orange-500 text-white font-bold p-2 rounded-lg hover:bg-neutral-50 hover:text-orange-500 transition"
          >
            Do You Want To Add Extra 5 Minutes?
          </button>
        </div>
      )}

      {/* Question Navigation */}
      <div className="flex flex-wrap gap-2 mb-5">
        {SingleQuestion.map((_, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className={`w-10 h-10 flex items-center justify-center rounded-full ${
              answers[index]
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            } ${
              currentQuestionIndex === index
                ? "ring-2 ring-orange-500"
                : "hover:ring-2 hover:ring-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Question Display */}
      <div className="p-5 border rounded-lg shadow-lg bg-white">
        <h2 className="text-base font-bold mb-2 text-gray-800">
          Question {currentQuestionIndex + 1}
        </h2>
        <p className="mb-4 text-gray-700">{currentQuestion?.question}</p>

        {/* Multiple-Choice Options */}
        <div className="flex flex-col space-y-2">
          {currentQuestion?.incorrect_answers
            ?.concat(currentQuestion?.correct_answer)
            .sort() // Randomize order (optional)
            .map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className={`w-full p-2 rounded-md text-left ${
                  answers[currentQuestionIndex] === option
                    ? "bg-lime-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-5">
        <button
          onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
          className="bg-orange-500 text-white font-bold p-2 rounded-lg hover:bg-neutral-50 hover:text-orange-500 transition"
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentQuestionIndex((prev) =>
              Math.min(prev + 1, SingleQuestion.length - 1)
            )
          }
          className="bg-orange-500 text-white font-bold p-2 rounded-lg hover:bg-neutral-50 hover:text-orange-500 transition"
          disabled={currentQuestionIndex === SingleQuestion.length - 1}
        >
          Next
        </button>
      </div>

      {/* Finish Button */}
      {allAttempted && (
        <div className="mt-5">
          <button
            onClick={handleFinish}
            className="w-full bg-red-500 text-white font-bold p-3 rounded-lg hover:bg-red-600"
          >
            Finish
          </button>
        </div>
      )}
    </AnimateProvider>
  );
}

export default SingleQuestion;
