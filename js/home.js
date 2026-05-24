// js/home.js — home screen: mode toggle, category filters, file upload, start button

import { state } from "./state.js";
import { $, setText } from "./ui.js";
import { CATEGORIES } from "../data/questions.js";

/**
 * Initialise the home screen.
 * @param {{ onStart: Function }} callbacks
 */
export function initHome({ onStart }) {
  state.selectedCats = new Set(CATEGORIES);

  buildCategoryTags();
  bindModeCards();
  bindSliders();
  bindFileUpload();
  updateStartBtn();

  $("start-btn").addEventListener("click", onStart);
}

// ── Category tags ────────────────────────────────────────────────────────────

function buildCategoryTags() {
  const row = $("cat-tags");
  row.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "tag active";
    btn.textContent = cat;
    btn.addEventListener("click", () => toggleCategory(cat, btn));
    row.appendChild(btn);
  });
}

function toggleCategory(cat, el) {
  // Always keep at least one category active
  if (state.selectedCats.has(cat) && state.selectedCats.size === 1) return;
  state.selectedCats.has(cat)
    ? state.selectedCats.delete(cat)
    : state.selectedCats.add(cat);
  el.classList.toggle("active", state.selectedCats.has(cat));
}

// ── Mode toggle ──────────────────────────────────────────────────────────────

function bindModeCards() {
  $("mode-builtin").addEventListener("click", () => setMode("builtin"));
  $("mode-upload").addEventListener("click", () => setMode("upload"));
}

export function setMode(m) {
  state.mode = m;
  $("mode-builtin").classList.toggle("active", m === "builtin");
  $("mode-upload").classList.toggle("active", m === "upload");
  $("builtin-config").style.display = m === "builtin" ? "" : "none";
  $("upload-config").style.display = m === "upload" ? "" : "none";
  updateStartBtn();
}

// ── Sliders ──────────────────────────────────────────────────────────────────

function bindSliders() {
  $("num-slider").addEventListener("input", (e) =>
    setText("num-disp", e.target.value),
  );
  $("gen-slider").addEventListener("input", (e) =>
    setText("gen-disp", e.target.value),
  );
}

// ── File upload ──────────────────────────────────────────────────────────────

function bindFileUpload() {
  const zone = $("drop-zone");
  const input = $("file-input");

  zone.addEventListener("click", () => input.click());
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("drag-over");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    processFile(e.dataTransfer.files[0]);
  });
  input.addEventListener("change", () => processFile(input.files[0]));
  $("file-clear").addEventListener("click", clearFile);
}

function processFile(file) {
  if (!file) return;
  state.uploadedFile = file;
  setText("file-name", file.name);
  $("file-chosen").style.display = "flex";
  $("drop-zone").style.display = "none";
  updateStartBtn();
}

function clearFile() {
  state.uploadedFile = null;
  $("file-input").value = "";
  $("file-chosen").style.display = "none";
  $("drop-zone").style.display = "";
  updateStartBtn();
}

// ── Start button state ───────────────────────────────────────────────────────

export function updateStartBtn() {
  const btn = $("start-btn");
  if (state.mode === "upload") {
    btn.disabled = !state.uploadedFile;
    btn.innerHTML = state.uploadedFile
      ? '<i class="ti ti-cpu"></i> Generate & start'
      : '<i class="ti ti-upload"></i> Upload a file first';
  } else {
    btn.disabled = false;
    btn.innerHTML = '<i class="ti ti-player-play"></i> Start quiz';
  }
}
