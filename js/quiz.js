import { state, resetQuizCounters } from "./state.js";
import { OPTION_LETTERS } from "./questions.js";
import {
  showScreen,
  hideScreen,
  hideResult,
  renderQuestion,
  markAnswer,
  updateScore,
  showNextButton,
  hideNextButton,
  animateCardOut,
  renderResult,
  showResult,
} from "./ui.js";

/** Start a fresh quiz with the given question array. */
export function beginQuiz(questions) {
  state.activeQuestions = questions;
  state.lastQuestions = [...questions];
  resetQuizCounters();

  hideScreen("home-screen");
  hideResult();
  showScreen("quiz-screen");
  updateScore(0);

  loadQuestion();
}

function loadQuestion() {
  state.answered = false;
  hideNextButton();

  const q = state.activeQuestions[state.currentQ];
  const total = state.activeQuestions.length;
  const buttons = renderQuestion(q, state.currentQ, total, OPTION_LETTERS);

  buttons.forEach((btn, i) => {
    btn.addEventListener("click", () => handleAnswer(i, buttons));
  });
}

function handleAnswer(chosenIndex, buttons) {
  if (state.answered) return;
  state.answered = true;

  const q = state.activeQuestions[state.currentQ];
  markAnswer(buttons, chosenIndex, q.answer);

  if (chosenIndex === q.answer) {
    state.score++;
    state.correct++;
  } else {
    state.wrong++;
  }

  updateScore(state.score);
  showNextButton(state.currentQ === state.activeQuestions.length - 1);
}

/** Advance to the next question or show results. */
export function nextQuestion() {
  if (state.currentQ >= state.activeQuestions.length - 1) {
    finishQuiz();
    return;
  }

  animateCardOut(() => {
    state.currentQ++;
    loadQuestion();
  });
}

function finishQuiz() {
  hideScreen("quiz-screen");
  renderResult(
    state.score,
    state.activeQuestions.length,
    state.correct,
    state.wrong,
  );
  showResult();
}

/** Replay the same question set in a new random order. */
export function replayQuiz() {
  const shuffled = [...state.lastQuestions].sort(() => Math.random() - 0.5);
  beginQuiz(shuffled);
}
