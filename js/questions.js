export const BUILTIN_QUESTIONS = [
  {
    category: "Science",
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
    answer: 1,
  },
  {
    category: "Science",
    question: "How many bones are in the adult human body?",
    options: ["196", "206", "216", "226"],
    answer: 1,
  },
  {
    category: "Science",
    question: "What planet is known as the Red Planet?",
    options: ["Venus", "Jupiter", "Mars", "Saturn"],
    answer: 2,
  },
  {
    category: "Science",
    question: "What gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"],
    answer: 2,
  },
  {
    category: "Geography",
    question: "Which country has the most natural lakes?",
    options: ["Russia", "USA", "Brazil", "Canada"],
    answer: 3,
  },
  {
    category: "Geography",
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    answer: 2,
  },
  {
    category: "Geography",
    question: "Which is the longest river in the world?",
    options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
    answer: 1,
  },
  {
    category: "History",
    question: "In what year did World War II end?",
    options: ["1943", "1944", "1945", "1946"],
    answer: 2,
  },
  {
    category: "History",
    question: "Who was the first person to walk on the Moon?",
    options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "John Glenn"],
    answer: 2,
  },
  {
    category: "History",
    question: "The Berlin Wall fell in which year?",
    options: ["1987", "1988", "1989", "1990"],
    answer: 2,
  },
  {
    category: "Technology",
    question: "What does 'HTTP' stand for?",
    options: [
      "HyperText Transfer Protocol",
      "High Tech Transfer Process",
      "Hyperlink Text Transfer Protocol",
      "HyperText Transmission Path",
    ],
    answer: 0,
  },
  {
    category: "Technology",
    question: "Who co-founded Apple with Steve Jobs?",
    options: ["Bill Gates", "Steve Wozniak", "Paul Allen", "Larry Page"],
    answer: 1,
  },
  {
    category: "Literature",
    question: "Who wrote '1984'?",
    options: [
      "Aldous Huxley",
      "Ray Bradbury",
      "George Orwell",
      "Philip K. Dick",
    ],
    answer: 2,
  },
  {
    category: "Literature",
    question: "What is the first book of the Bible?",
    options: ["Exodus", "Genesis", "Leviticus", "Numbers"],
    answer: 1,
  },
  {
    category: "Mathematics",
    question: "What is the value of π to two decimal places?",
    options: ["3.12", "3.14", "3.16", "3.18"],
    answer: 1,
  },
];

export const CATEGORIES = [
  ...new Set(BUILTIN_QUESTIONS.map((q) => q.category)),
];

export const OPTION_LETTERS = ["A", "B", "C", "D"];

/**
 * Return a shuffled subset of questions filtered by category.
 * @param {Set<string>} selectedCats
 * @param {number} count
 * @returns {Array}
 */
export function getBuiltinQuestions(selectedCats, count) {
  const pool = BUILTIN_QUESTIONS.filter((q) => selectedCats.has(q.category));
  return pool
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, pool.length));
}
