// ── Screen visibility ────────────────────────────────────────────────────────

export function showScreen(id) {
  document.getElementById(id).style.display = "";
}

export function hideScreen(id) {
  document.getElementById(id).style.display = "none";
}

export function showGenerating(msg = "Generating questions from your file…") {
  document.getElementById("gen-text").textContent = msg;
  document.getElementById("generating-card").classList.add("visible");
}

export function hideGenerating() {
  document.getElementById("generating-card").classList.remove("visible");
}

export function showResult() {
  document.getElementById("result-card").classList.add("visible");
}

export function hideResult() {
  document.getElementById("result-card").classList.remove("visible");
}

// ── Home screen helpers ──────────────────────────────────────────────────────

export function setModeActive(mode) {
  document
    .getElementById("mode-builtin")
    .classList.toggle("active", mode === "builtin");
  document
    .getElementById("mode-upload")
    .classList.toggle("active", mode === "upload");
  document.getElementById("builtin-config").style.display =
    mode === "builtin" ? "" : "none";
  document.getElementById("upload-config").style.display =
    mode === "upload" ? "" : "none";
}

export function updateStartButton(mode, hasFile) {
  const btn = document.getElementById("start-btn");
  if (mode === "upload") {
    btn.disabled = !hasFile;
    btn.innerHTML = hasFile
      ? '<i class="ti ti-cpu"></i> Generate & start'
      : '<i class="ti ti-upload"></i> Upload a file first';
  } else {
    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-player-play"></i> Start quiz';
  }
}

export function showFileChosen(name) {
  document.getElementById("file-name").textContent = name;
  document.getElementById("file-chosen").style.display = "flex";
  document.getElementById("drop-zone").style.display = "none";
}

export function clearFileUI() {
  document.getElementById("file-chosen").style.display = "none";
  document.getElementById("drop-zone").style.display = "";
}

export function buildCategoryTags(categories, selectedCats, onToggle) {
  const row = document.getElementById("cat-tags");
  row.innerHTML = "";
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "tag active";
    btn.textContent = cat;
    btn.addEventListener("click", () => onToggle(cat, btn));
    row.appendChild(btn);
  });
}

// ── Quiz screen helpers ──────────────────────────────────────────────────────

export function renderQuestion(question, index, total, letters) {
  document.getElementById("q-counter").textContent =
    `Question ${index + 1} of ${total}`;
  document.getElementById("cat-label").textContent =
    question.category || "Quiz";
  document.getElementById("progress-fill").style.width =
    `${(index / total) * 100}%`;
  document.getElementById("question-text").textContent = question.question;

  const grid = document.getElementById("options-grid");
  grid.innerHTML = "";

  question.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `<span class="option-letter">${letters[i]}</span><span>${opt}</span>`;
    grid.appendChild(btn);
  });

  return Array.from(grid.querySelectorAll(".option-btn"));
}

export function markAnswer(buttons, chosenIndex, correctIndex) {
  buttons.forEach((b) => (b.disabled = true));
  buttons[chosenIndex].classList.add(
    chosenIndex === correctIndex ? "correct" : "wrong",
  );
  if (chosenIndex !== correctIndex)
    buttons[correctIndex].classList.add("correct");
}

export function updateScore(score) {
  document.getElementById("score-chip").textContent = `Score: ${score}`;
}

export function showNextButton(isLast) {
  const btn = document.getElementById("next-btn");
  btn.innerHTML = isLast
    ? 'Results <i class="ti ti-trophy"></i>'
    : 'Next <i class="ti ti-arrow-right"></i>';
  btn.classList.add("visible");
}

export function hideNextButton() {
  document.getElementById("next-btn").classList.remove("visible");
}

export function animateCardOut(onDone) {
  const card = document.getElementById("question-card");
  card.classList.add("exiting");
  setTimeout(() => {
    card.classList.remove("exiting");
    card.classList.add("entering");
    onDone();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => card.classList.remove("entering")),
    );
  }, 220);
}

// ── Result screen helpers ────────────────────────────────────────────────────

export function renderResult(score, total, correct, wrong) {
  const pct = Math.round((correct / total) * 100);

  document.getElementById("result-score").textContent = score;
  document.getElementById("result-of").textContent = `/ ${total}`;
  document.getElementById("bd-correct").textContent = correct;
  document.getElementById("bd-wrong").textContent = wrong;
  document.getElementById("bd-pct").textContent = `${pct}%`;

  const msgs = [
    [100, "Perfect score!"],
    [75, "Great job!"],
    [50, "Not bad at all!"],
    [0, "Keep practicing!"],
  ];
  const msg =
    msgs.find(([threshold]) => pct >= threshold)?.[1] ?? "Keep practicing!";
  document.getElementById("result-msg").textContent = msg;

  document.getElementById("progress-fill").style.width = "100%";
}
