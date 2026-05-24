# Quizify

A modular multiple-choice quiz app with built-in questions and AI-powered question generation from uploaded files.

## Project structure

```
quizify/
├── index.html          # App shell — markup only, no inline scripts or styles
├── css/
│   ├── variables.css   # Design tokens (colors, radii, font)
│   ├── base.css        # Reset, body, layout, shared utilities
│   ├── home.css        # Home screen — mode cards, config panel, upload zone
│   ├── quiz.css        # Quiz screen — progress bar, question card, options
│   └── result.css      # Result screen — ring, breakdown cells, action buttons
└── js/
    ├── main.js         # Entry point — event wiring, app init (ES module)
    ├── state.js        # Central mutable state object
    ├── questions.js    # Built-in question bank + filter/shuffle helpers
    ├── api.js          # Claude API integration (generateQuestionsFromFile)
    ├── quiz.js         # Quiz flow controller (beginQuiz, nextQuestion, replay)
    └── ui.js           # DOM read/write helpers — no business logic
```

## Running locally

Because `main.js` uses ES modules (`type="module"`), the app must be served over HTTP — opening `index.html` directly in a browser will not work.

Any static file server works:

```bash
# Node (npx)
npx serve .

# VS Code
 Use the "Live Server" extension and click "Go Live"
```

Then open `http://localhost:3000` in your browser.

## How it works

| Module         | Responsibility                                                     |
| -------------- | ------------------------------------------------------------------ |
| `state.js`     | Single source of truth for all runtime values                      |
| `questions.js` | Built-in bank; `getBuiltinQuestions()` filters and shuffles        |
| `api.js`       | Converts file → base64, builds Claude prompt, parses JSON response |
| `quiz.js`      | `beginQuiz()`, `nextQuestion()`, `replayQuiz()` — pure flow logic  |
| `ui.js`        | All DOM mutations; imported by `quiz.js` and `main.js`             |
| `main.js`      | Wires events to the above modules; no logic of its own             |

## Adding questions

Open `js/questions.js` and append to the `BUILTIN_QUESTIONS` array:

```js
{ category: "Science", question: "What is the speed of light?", options: ["299,792 km/s", "199,792 km/s", "399,792 km/s", "499,792 km/s"], answer: 0 },
```

New categories are picked up automatically — no other changes needed.

## API key

The Claude API key is injected by the Anthropic claude.ai environment when running inside the artifact sandbox. For standalone deployment, add your key to the fetch headers in `js/api.js`:

```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'YOUR_KEY_HERE',
  'anthropic-version': '2023-06-01',
},
```
