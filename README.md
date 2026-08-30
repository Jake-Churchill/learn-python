# Learn Python

An interactive, in-browser Python course built with React. No local Python
install required — code runs directly in the browser via
[Pyodide](https://pyodide.org/) (Python compiled to WebAssembly).

## Features

- 14 lessons covering core Python syntax and semantics, from variables to
  classes and list comprehensions
- Runnable, editable code examples in every lesson (CodeMirror-powered)
- Auto-checked exercises with immediate output-matching feedback
- Progress tracking persisted locally via `localStorage`
- All Python execution happens in a Web Worker, so the UI never blocks

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-router-dom](https://reactrouter.com/) for lesson routing
- [Pyodide](https://pyodide.org/) for in-browser Python execution
- [CodeMirror 6](https://codemirror.net/) (`@uiw/react-codemirror`) for code editing
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) for tests

## Getting Started

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser. First load fetches and
initializes Pyodide (~6 MB, a few seconds); it's cached by the browser after
that.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint the codebase with oxlint |

## Project Structure

```
src/
  worker/pyodideWorker.js   # Loads Pyodide once, executes code, captures stdout
  hooks/                    # Pyodide client + React context, progress tracking
  blocks/                   # Lesson content block renderers (prose, example, exercise)
  components/               # Layout, sidebar, status badge
  content/courses/          # Lesson content, organized by course
  pages/                    # Home and Lesson route components
```

Design and implementation notes (from the original build process) live in
[`docs/superpowers/`](docs/superpowers/).

## License

MIT — see [LICENSE](LICENSE).
