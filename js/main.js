import { state } from "./state.js";
import { CATEGORIES, getBuiltinQuestions } from "./questions.js";
import { generateQuestionsFromFile } from "./api.js";
import {
  setModeActive,
  updateStartButton,
  showFileChosen,
  clearFileUI,
  buildCategoryTags,
  showScreen,
  hideScreen,
  showGenerating,
  hideGenerating,
  hideResult,
} from "./ui.js";
import { beginQuiz, nextQuestion, replayQuiz } from "./quiz.js";

// ── Initialise category state and tags ───────────────────────────────────────

state.selectedCats = new Set(CATEGORIES);

buildCategoryTags(CATEGORIES, state.selectedCats, (cat, btn) => {
  if (state.selectedCats.has(cat) && state.selectedCats.size === 1) return;
  state.selectedCats.has(cat)
    ? state.selectedCats.delete(cat)
    : state.selectedCats.add(cat);
  btn.classList.toggle("active", state.selectedCats.has(cat));
});

// ── Mode switcher ────────────────────────────────────────────────────────────

document
  .getElementById("mode-builtin")
  .addEventListener("click", () => switchMode("builtin"));
document
  .getElementById("mode-upload")
  .addEventListener("click", () => switchMode("upload"));

function switchMode(mode) {
  state.mode = mode;
  setModeActive(mode);
  updateStartButton(mode, !!state.uploadedFile);
}

// ── Slider live display ──────────────────────────────────────────────────────

document.getElementById("num-slider").addEventListener("input", (e) => {
  document.getElementById("num-disp").textContent = e.target.value;
});

document.getElementById("gen-slider").addEventListener("input", (e) => {
  document.getElementById("gen-disp").textContent = e.target.value;
});

// ── File upload ──────────────────────────────────────────────────────────────

const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");

dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});
dropZone.addEventListener("dragleave", () =>
  dropZone.classList.remove("drag-over"),
);
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener("change", (e) => {
  if (e.target.files[0]) processFile(e.target.files[0]);
});

document.getElementById("file-clear").addEventListener("click", () => {
  state.uploadedFile = null;
  fileInput.value = "";
  clearFileUI();
  updateStartButton(state.mode, false);
});

function processFile(file) {
  state.uploadedFile = file;
  showFileChosen(file.name);
  updateStartButton(state.mode, true);
}

// ── Start quiz ───────────────────────────────────────────────────────────────

document.getElementById("start-btn").addEventListener("click", async () => {
  if (state.mode === "builtin") {
    const count = parseInt(document.getElementById("num-slider").value, 10);
    const questions = getBuiltinQuestions(state.selectedCats, count);
    beginQuiz(questions);
    return;
  }

  // Upload mode — call Claude API
  hideScreen("home-screen");
  showGenerating();

  try {
    const count = parseInt(document.getElementById("gen-slider").value, 10);
    const topic = document.getElementById("topic-input").value.trim();
    const questions = await generateQuestionsFromFile(
      state.uploadedFile,
      count,
      topic,
    );
    hideGenerating();
    beginQuiz(questions);
  } catch (err) {
    console.error(err);
    showGenerating(
      "Something went wrong generating questions. Please try again.",
    );
    setTimeout(() => {
      hideGenerating();
      showScreen("home-screen");
    }, 2500);
  }
});

// ── Quiz navigation ──────────────────────────────────────────────────────────

document.getElementById("next-btn").addEventListener("click", nextQuestion);

// ── Result actions ───────────────────────────────────────────────────────────

document.getElementById("play-again-btn").addEventListener("click", replayQuiz);

document.getElementById("change-quiz-btn").addEventListener("click", () => {
  hideResult();
  hideScreen("quiz-screen");
  showScreen("home-screen");
});

// ── Init ─────────────────────────────────────────────────────────────────────

updateStartButton("builtin", false);
