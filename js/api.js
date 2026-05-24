const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

/**
 * Convert a File object to a base64 string.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

/**
 * Build the content array for the Claude API request.
 * @param {File} file
 * @param {string} base64
 * @param {number} count
 * @param {string} topic
 * @returns {Array}
 */
async function buildContentArray(file, base64, count, topic) {
  const content = [];

  if (file.type === "application/pdf") {
    content.push({
      type: "document",
      source: { type: "base64", media_type: "application/pdf", data: base64 },
    });
  } else {
    const text = await file.text();
    content.push({ type: "text", text: `File contents:\n\n${text}` });
  }

  const topicLine = topic ? `Focus the questions on: ${topic}.` : "";
  content.push({
    type: "text",
    text: [
      `Generate exactly ${count} multiple-choice quiz questions from the content above.`,
      topicLine,
      "Return ONLY a JSON array — no preamble, no markdown fences.",
      'Each item: {"category":"<topic>","question":"<question>","options":["A","B","C","D"],"answer":<0-indexed int>}',
    ]
      .filter(Boolean)
      .join(" "),
  });

  return content;
}

/**
 * Call the Claude API to generate quiz questions from a file.
 * @param {File} file
 * @param {number} count
 * @param {string} topic
 * @returns {Promise<Array>} Parsed array of question objects
 */
export async function generateQuestionsFromFile(file, count, topic = "") {
  const base64 = await fileToBase64(file);
  const content = await buildContentArray(file, base64, count, topic);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: [{ role: "user", content }],
    }),
  });

  const data = await response.json();
  const raw = data.content.map((block) => block.text || "").join("");
  const clean = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("No questions returned from API");
  }

  return parsed;
}
