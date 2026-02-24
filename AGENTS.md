# AGENTS.md

Repository guidance for autonomous coding agents working in `listmyfavorites.github.io`.

## 1) Project Snapshot

- Stack: static HTML + CSS + vanilla JavaScript (no bundler, no framework).
- Primary runtime surface: browser.
- Test/runtime helper: Node.js used only for local tests and syntax checks.
- Data backend: GitHub Gist API from client-side code.
- Search library: Fuse.js loaded from CDN in `index.html`.

## 2) Source of Truth for Commands

- CI workflow: `.github/workflows/test.yml`.
- Local development notes: `README.md`.
- There is no `package.json` in this repository.
- There are no npm scripts to rely on.

## 3) Build / Lint / Test Commands

Use commands from repo root (`C:/Users/Calvin-Xia/Documents/GitHub/listmyfavorites.github.io`).

### Test Commands

- Run SearchEngine tests:
  - `node tests/SearchEngine.test.js`
- Run FavoritesService tests:
  - `node tests/FavoritesService.test.js`
- Run all tests (CI-equivalent sequence):
  - `node tests/SearchEngine.test.js && node tests/FavoritesService.test.js`

### Single Test Execution (Important)

- This repo uses plain Node test files, so "single test" means single test file.
- Run one test file directly:
  - `node tests/SearchEngine.test.js`
  - `node tests/FavoritesService.test.js`
- There is no framework-level test filtering flag (no Jest/Vitest/Mocha config).

### Syntax Check (Closest Thing to Lint in CI)

- JS syntax validation:
  - `node --check script.js`

### Build / Lint / Typecheck Status

- Build command: not configured.
- Lint command: not configured.
- Typecheck command: not configured (JSDoc-annotated JavaScript only).
- If you add build/lint/typecheck tooling, update this file and CI workflow.

## 4) Local Run / Preview

- Per `README.md`, open `index.html` directly in a browser for preview.
- Keep the app runnable as static files (GitHub Pages-compatible).

## 5) Repository Layout

- `index.html`: app shell, CSP, CDN script include, and DOM structure.
- `script.js`: all app logic (service/view/search/modal/app orchestration).
- `style.css`: full visual system and responsive styling.
- `tests/SearchEngine.test.js`: standalone SearchEngine tests.
- `tests/FavoritesService.test.js`: standalone FavoritesService tests.
- `.github/workflows/test.yml`: CI checks.

## 6) JavaScript Style Conventions

Follow existing patterns in `script.js` and tests.

- Use 4-space indentation in JavaScript.
- Use semicolons consistently.
- Use single quotes for strings.
- Prefer `const`, use `let` only when reassignment is required.
- Keep class/method blocks separated by blank lines for readability.
- Prefer arrow callbacks for event handlers and array iteration.
- Keep method responsibilities small and focused.
- Use early returns for validation failures.
- Avoid inline magic behavior; use helper methods (`buildDataUrl`, `ensureFuse`, etc.).
- No module imports/exports in current architecture.

## 7) Typing and Documentation Conventions

- Use JSDoc typedefs for domain objects (see top of `script.js`).
- Document class methods with `@param`, `@returns`, and `@throws` when relevant.
- Keep runtime guards even with JSDoc (external data is untrusted).
- Prefer explicit fallback handling with `??` and optional chaining `?.`.
- Maintain contract comments when adding/changing public methods.

## 8) Naming Conventions

- Classes: `PascalCase` (`FavoritesService`, `ModalController`, `FavoritesApp`).
- Functions/methods/variables: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` for fixed config (`GIST_CONFIG`).
- CSS classes and IDs in markup/styles: mostly kebab-case for classes, camelCase for IDs.
- Test names: readable sentence-like strings inside `test('...')`.

## 9) Error Handling Conventions

- Throw `Error` with actionable, user-facing messages in service/domain methods.
- Catch where recovery/UI feedback is possible.
- Log technical detail with `console.error(...)` including context prefix.
- Show user-visible feedback through view/modal status methods.
- Never swallow errors silently.
- Preserve `try/catch/finally` around async save flows.
- Keep global fallbacks (`error`, `unhandledrejection`) intact unless replacing with better UX.

## 10) HTML / CSS Conventions

- Keep HTML semantic and simple; avoid framework-specific constructs.
- Preserve CSP requirements in `<meta http-equiv="Content-Security-Policy">`.
- External links opened in new tab should include `rel="noopener noreferrer"`.
- CSS uses design tokens in `:root`; extend tokens before hardcoding new colors.
- Keep sectioned CSS comments and ordering style used in `style.css`.
- Maintain responsive behavior at existing breakpoints (`768px`, `480px`).
- Maintain reduced-motion support (`prefers-reduced-motion`).

## 11) Architecture Conventions

- Keep separation of concerns:
  - Service layer for network/Gist operations.
  - View layer for DOM rendering.
  - Controller/app layer for wiring state/events.
- Initialize app from `DOMContentLoaded`.
- Cache key DOM references once; avoid repeated global lookups.
- Keep storage logic behind `TokenStorage` abstraction.
- Keep search behavior isolated in `SearchEngine`.

## 12) Testing Conventions

- Tests are plain Node scripts with tiny custom helpers (`test`, assertions).
- Each test file is self-contained; no external test framework APIs.
- Keep tests deterministic and side-effect free.
- Print explicit pass/fail markers (`✓` / `✗`) as current files do.
- When changing behavior in `script.js`, update matching test logic in `tests/`.
- CI currently runs two test files + `node --check script.js`; keep parity.

## 13) Security and Data Handling

- Do not commit real GitHub tokens or secrets.
- Token is stored in `localStorage`; never log token values.
- Validate user input (`name`, `url`, `description`) before remote write.
- Preserve URL validation via `new URL(...)`.
- Keep JSON parse safeguards when reading remote content.

## 14) Agent Rule Files Check (Cursor / Copilot)

As of current repository scan:

- `.cursorrules`: not found.
- `.cursor/rules/`: not found.
- `.github/copilot-instructions.md`: not found.

Therefore, this `AGENTS.md` is the primary agent guidance file in this repo.

## 15) Pre-PR Verification Checklist

Before finishing changes, run:

- `node tests/SearchEngine.test.js`
- `node tests/FavoritesService.test.js`
- `node --check script.js`

And manually verify in browser:

- Search works in exact and fuzzy modes.
- Add-favorite modal validation and save flow still function.
- Empty-state and error-state rendering still look correct.
