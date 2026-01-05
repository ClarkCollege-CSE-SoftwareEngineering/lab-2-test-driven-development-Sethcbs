# Lab 2: Test-Driven Development with Vitest
**Week 2 | Testing II (TDD)**

## Overview

In this lab, you'll build a string utility library using **Test-Driven Development (TDD)**. Rather than writing code first and tests second, you'll practice the Red-Green-Refactor cycle: write a failing test, write just enough code to pass it, then improve your code's design.

By the end of this lab, you'll have a working utility library with comprehensive test coverage—and more importantly, you'll experience how TDD shapes the way you think about code.

**Time Estimate:** 90-120 minutes  
**Prerequisites:** Completion of Lab 1 (Vitest setup), Week 2 readings

> [!IMPORTANT]
> **Windows Users:** We recommend using [PowerShell](https://microsoft.com/powershell) instead of Command Prompt for this lab. PowerShell supports most Unix-style commands. Where commands differ, we provide both versions.

## Learning Objectives

By completing this lab, you will be able to:

1. **Apply** the Red-Green-Refactor cycle to develop functions incrementally
2. **Distinguish** between testing behavior vs. testing implementation details
3. **Write** focused unit tests that verify expected outputs for given inputs
4. **Recognize** when to use test doubles (and when real implementations suffice)
5. **Explain** how TDD influences code design decisions
6. **Achieve** high test coverage through test-first development

## Connection to Readings

This lab directly applies concepts from your Week 2 readings:

### From "Mocks Aren't Stubs" (Martin Fowler)
- **State verification vs. behavior verification:** In this lab, we'll primarily use *state verification*—checking that functions return expected values. Fowler describes this as examining "the state of the SUT [System Under Test] and its collaborators after the method was exercised."
- **Classical TDD approach:** We'll follow the classical TDD style, using real implementations where possible and reserving test doubles for truly awkward dependencies.

### From "Test Double" (Martin Fowler)
- You'll see how simple utility functions rarely need test doubles—they have no external dependencies to isolate.
- This reinforces Fowler's point that dummies, stubs, and mocks serve specific purposes; not every test needs them.

### From "Testing Implementation Details" (Kent C. Dodds)
- We'll write tests that verify *what* functions do, not *how* they do it internally.
- If you refactor the implementation, your tests should still pass (that's the goal!).

---

## Part 1: Project Setup (15 minutes)

### Step 1.1: Initialize the Project

Create a new directory and initialize it:

```bash
# Linux/macOS/PowerShell:
mkdir tdd-string-utils && cd tdd-string-utils

# Windows Command Prompt:
mkdir tdd-string-utils && cd tdd-string-utils
```

Initialize the project with TypeScript:

```bash
npm init -y
npm install -D typescript vitest @types/node
```

### Step 1.2: Configure TypeScript

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 1.3: Configure Vitest

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'vitest.config.ts',
      ],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
});
```

### Step 1.4: Update package.json

Add these scripts to your `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "build": "tsc"
  }
}
```

### Step 1.5: Create Directory Structure

```bash
# Linux/macOS/PowerShell:
mkdir -p src/__tests__

# Windows Command Prompt:
mkdir src\__tests__
```

✅ **Checkpoint:** Run `npm test` — it should complete (with no tests found yet). Your project structure should look like:

```
tdd-string-utils/
├── node_modules/
├── src/
│   └── __tests__/
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## Part 2: Your First TDD Cycle — `capitalize()` (25 minutes)

Now we'll practice the Red-Green-Refactor cycle. Remember: **write the test first**, watch it fail, then write the minimum code to pass.

### Step 2.1: RED — Write a Failing Test

Create `src/__tests__/stringUtils.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { capitalize } from '../stringUtils';

describe('capitalize', () => {
  it('capitalizes the first letter of a lowercase word', () => {
    expect(capitalize('hello')).toBe('Hello');
  });
});
```

Run the test:

```bash
npm test
```

✅ **Checkpoint:** You should see a **red** failing test. The error will say something like "Cannot find module '../stringUtils'". This is expected! We haven't written the implementation yet.

🤔 **Reflection Question:** Why do we intentionally write a failing test first? How does this relate to what Fowler describes as "state verification"?

### Step 2.2: GREEN — Write Minimal Code to Pass

Create `src/stringUtils.ts` with the absolute minimum to pass:

```typescript
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

Run the test:

```bash
npm test
```

✅ **Checkpoint:** Your test should now **pass** (green). We wrote just enough code—nothing more.

### Step 2.3: Add More Test Cases (Still in RED-GREEN)

Now let's handle edge cases. Add these tests one at a time, running tests after each addition:

```typescript
describe('capitalize', () => {
  it('capitalizes the first letter of a lowercase word', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('returns an already capitalized word unchanged', () => {
    expect(capitalize('Hello')).toBe('Hello');
  });

  it('handles single character strings', () => {
    expect(capitalize('a')).toBe('A');
  });

  it('returns empty string for empty input', () => {
    expect(capitalize('')).toBe('');
  });

  it('handles strings starting with numbers', () => {
    expect(capitalize('123abc')).toBe('123abc');
  });
});
```

Run tests after each new test case. Some may already pass! That's fine—it means our implementation was more robust than we initially needed.

### Step 2.4: REFACTOR — Improve the Code

Our current implementation works, but let's consider: is it as clear as it could be?

Look at the current implementation:

```typescript
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

This is actually quite clean. The refactor step might be a no-op here. **That's okay!** Refactoring isn't mandatory—it's an opportunity to improve.

🤔 **Reflection Question:** In the mockist vs. classicist debate from Fowler's article, which approach are we using here? Why don't we need any test doubles for this function?

---

## Part 3: Guided TDD — `truncate()` (25 minutes)

Let's build a more complex function that truncates strings with an ellipsis.

### Step 3.1: RED — Define the Behavior Through Tests

Add a new describe block in `src/__tests__/stringUtils.test.ts`:

```typescript
import { capitalize, truncate } from '../stringUtils';

// ... existing capitalize tests ...

describe('truncate', () => {
  it('returns the original string if shorter than max length', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns the original string if equal to max length', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates and adds ellipsis when string exceeds max length', () => {
    expect(truncate('hello world', 8)).toBe('hello...');
  });

  it('handles max length of 3 (minimum for ellipsis)', () => {
    expect(truncate('hello', 3)).toBe('...');
  });

  it('throws error for max length less than 3', () => {
    expect(() => truncate('hello', 2)).toThrow('maxLength must be at least 3');
  });
});
```

Run the tests:

```bash
npm test
```

✅ **Checkpoint:** All `truncate` tests should fail (red) because the function doesn't exist.

### Step 3.2: GREEN — Implement Incrementally

Add to `src/stringUtils.ts`:

```typescript
export function truncate(str: string, maxLength: number): string {
  if (maxLength < 3) {
    throw new Error('maxLength must be at least 3');
  }
  
  if (str.length <= maxLength) {
    return str;
  }
  
  return str.slice(0, maxLength - 3) + '...';
}
```

Run the tests:

```bash
npm test
```

✅ **Checkpoint:** All tests should pass (green).

### Step 3.3: REFACTOR — Consider Alternatives

Look at this line:

```typescript
return str.slice(0, maxLength - 3) + '...';
```

We could extract the ellipsis to a constant:

```typescript
const ELLIPSIS = '...';

export function truncate(str: string, maxLength: number): string {
  if (maxLength < ELLIPSIS.length) {
    throw new Error(`maxLength must be at least ${ELLIPSIS.length}`);
  }
  
  if (str.length <= maxLength) {
    return str;
  }
  
  return str.slice(0, maxLength - ELLIPSIS.length) + ELLIPSIS;
}
```

Run tests again to ensure nothing broke:

```bash
npm test
```

🤔 **Reflection Question:** Notice that we changed the implementation significantly (extracted a constant, changed the error message), but our tests still pass. This is what Kent C. Dodds means by "not testing implementation details." What would a test that *does* test implementation details look like?

---

## Part 4: Independent TDD — `slugify()` (30 minutes)

Now it's your turn! Implement a `slugify` function using TDD. This function converts a string to a URL-friendly "slug" (e.g., "Hello World!" → "hello-world").

### Requirements

- Convert to lowercase
- Replace spaces with hyphens
- Remove non-alphanumeric characters (except hyphens)
- Collapse multiple hyphens into one
- Trim hyphens from start and end

### Your Task

**TODO:** Write at least 6 test cases FIRST, then implement the function.

Start by adding this skeleton to your test file:

```typescript
describe('slugify', () => {
  // TODO: Add at least 6 test cases
  // Consider: basic conversion, special characters, multiple spaces,
  // leading/trailing spaces, already-valid slugs, empty strings
  
  it('converts a simple string to lowercase with hyphens', () => {
    // TODO: Write this test
  });

  it('removes special characters', () => {
    // TODO: Write this test
  });

  it('collapses multiple spaces/hyphens into single hyphens', () => {
    // TODO: Write this test
  });

  it('trims hyphens from start and end', () => {
    // TODO: Write this test
  });

  // TODO: Add at least 2 more test cases
});
```

Then implement `slugify` in `src/stringUtils.ts`:

```typescript
export function slugify(str: string): string {
  // TODO: Implement this function using TDD
  // Remember: write each test first, see it fail, then make it pass
  throw new Error('Not implemented');
}
```

✅ **Checkpoint:** When complete, run `npm run test:coverage`. All tests should pass, and you should have at least 90% coverage.

---

## Part 5: Verify Coverage and Document (15 minutes)

### Step 5.1: Run Coverage Report

```bash
npm run test:coverage
```

✅ **Checkpoint:** Coverage should be at least 90% across all metrics. If not, identify untested code paths and add tests.

### Step 5.2: Create Your README

Create or update the `README.md` in your project root with:

1. **Project description** (1-2 sentences)
2. **How to run tests** (commands)
3. **Functions implemented** (brief description of each)
4. **Reflection section** answering:
   - How did TDD change the way you approached implementing `slugify`?
   - Which of Fowler's test double types (dummy, stub, fake, spy, mock) did you need for this lab? Why or why not?
   - What's one thing that would have been different if you wrote the implementation first?

---

## Deliverables

Your repository should contain:

```
tdd-string-utils/
├── .github/
│   └── workflows/
│       └── test.yml         # GitHub Actions (provided)
├── src/
│   ├── __tests__/
│   │   └── stringUtils.test.ts  # At least 16 tests
│   └── stringUtils.ts           # capitalize, truncate, slugify
├── .gitignore
├── package.json
├── README.md                    # With reflection section
├── tsconfig.json
└── vitest.config.ts
```

### Requirements Checklist

- [ ] All three functions implemented: `capitalize`, `truncate`, `slugify`
- [ ] At least 16 total test cases
- [ ] 90%+ test coverage
- [ ] README with reflection section
- [ ] All tests passing
- [ ] TypeScript compiles without errors

---

## Grading Rubric

| Criterion | Points | Description |
|-----------|--------|-------------|
| **Project Setup** | 15 | TypeScript, Vitest, and scripts configured correctly |
| **Guided Functions** | 20 | `capitalize` and `truncate` implemented with all provided tests passing |
| **Independent TDD (`slugify`)** | 20 | At least 6 well-designed tests; function fully implemented |
| **Test Coverage** | 15 | 90%+ coverage across all metrics |
| **README & Reflection** | 20 | Clear documentation; thoughtful answers connecting to readings |
| **Code Quality** | 10 | Clean code, meaningful names, proper TypeScript types |
| **Total** | **100** | |

---

## Stretch Goals

Finished early? Try these extensions:

1. **Add `camelCase()` function** — Convert "hello-world" or "hello_world" to "helloWorld"
2. **Add `kebabCase()` function** — Convert "helloWorld" to "hello-world"
3. **Add custom ellipsis option** — Modify `truncate` to accept an optional custom ellipsis string
4. **Explore parameterized tests** — Use Vitest's `it.each()` to reduce test code duplication

---

## Troubleshooting

### "Cannot find module" errors

Make sure your import path matches your file structure. The import should be:
```typescript
import { capitalize } from '../stringUtils';  // Note: no .ts extension
```

### TypeScript errors about `expect`

Ensure `globals: true` is set in `vitest.config.ts`, or explicitly import:
```typescript
import { describe, it, expect } from 'vitest';
```

### Coverage below 90%

Check the HTML coverage report in `coverage/index.html` to see which lines aren't covered. Add tests for those code paths.

### Tests pass locally but fail in GitHub Actions

- Check that all dependencies are in `package.json` (not just installed locally)
- Ensure `package.json` has `"type": "module"`
- Verify the test script works with `npm test` (not just `vitest`)

---

## Submission

1. Push your completed code to your GitHub repository
2. Verify that GitHub Actions tests pass (green checkmark)
3. Submit your repository URL via Canvas

**Due:** Monday of Week 3 (see Canvas for exact date/time)

---

## Resources

- 🔗 [Vitest Documentation](https://vitest.dev/)
- 🔗 [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) — Martin Fowler
- 🔗 [Test Double](https://martinfowler.com/bliki/TestDouble.html) — Martin Fowler
- 🔗 [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details) — Kent C. Dodds
