export const state = {
  mode: "builtin", // 'builtin' | 'upload'
  selectedCats: new Set(), // active category filters
  uploadedFile: null, // File | null
  activeQuestions: [], // current quiz question set
  lastQuestions: [], // snapshot for replay

  currentQ: 0,
  score: 0,
  correct: 0,
  wrong: 0,
  answered: false,
};

export function resetQuizCounters() {
  state.currentQ = 0;
  state.score = 0;
  state.correct = 0;
  state.wrong = 0;
  state.answered = false;
}
