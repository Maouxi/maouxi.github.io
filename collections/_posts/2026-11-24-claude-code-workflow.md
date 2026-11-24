---
title: Building a production app with Claude Code, step by step
icons: [flutter, firebase]
skills: [Flutter, Firebase, Git]
---

I built Gribilou, a Flutter + Firebase app, with Claude Code as my pair programmer. The six feature steps took five days, from October 15 to October 19. The part I want to share isn't the speed, it's the process: what I put around the AI so the code stays the code I would have written, and what I threw away once the app was done.

- [The starting point: a CLAUDE.md as a contract](#the-starting-point-a-claudemd-as-a-contract)
- [Features: spec, plan, build](#features-spec-plan-build)
  - [A skill that drives the process](#a-skill-that-drives-the-process)
- [After the features: tickets](#after-the-features-tickets)
  - [Where the tickets came from](#where-the-tickets-came-from)
  - [The ticket skill](#the-ticket-skill)
  - [Two validations, nothing in between](#two-validations-nothing-in-between)
  - [Test first, even for the AI](#test-first-even-for-the-ai)
- [Keep it cheap](#keep-it-cheap)
- [The cleanup](#the-cleanup)
- [What worked, what didn't](#what-worked-what-didnt)

## The starting point: a CLAUDE.md as a contract

Claude Code reads a `CLAUDE.md` at the root of the repository on every session. Most examples online use it as a README. I use it as an **architecture contract**: the rules a reviewer would enforce on a pull request.

A few lines from Gribilou's:

```md
- Fallible operations return `Either<GbException, T>`; no value → `Unit`; absent values → `Option<T>`.
  Never throw across layers.
- Every app action goes through a **use case** in `gribilou_domain` (`<verb>_<noun>_use_case.dart`, `call()`),
  exposed by a provider in `gribilou_di/providers/publics`. Repositories/datasources are internal.
- i18n: slang, sources in `en.i18n.json` and `fr.i18n.json` (always update both).
- Theme: colors from `Theme.of(context).appColors`, never literal colors in features.
- Crashlytics/Analytics: never log personal data (emails, names, child data).
- Any new collection or query needs matching rules and, if composite, an index.
```

What makes these useful:

- **They are checkable.** "Write clean code" is not. "Never literal colors in features" is: a review can grep for it.
- **They name files and patterns.** The AI copies what exists. Telling it *where* the pattern lives (`FirestoreDatasource`, `FirestorePaths`, `Validate.required`) is worth more than describing it.
- **They include the "why not".** "One Firebase project for both flavors (deliberate): dev builds hit production data, so test with dedicated accounts." Without the word *deliberate*, an assistant will helpfully "fix" it.

The file also lists the exact commands (`melos run test`, `melos run test:rules`, how to run a single test). An agent that can run the tests checks its own work.

## Features: spec, plan, build

The app was split into six build steps: foundation, account and onboarding, family, drawings, timeline, settings and premium. Each one followed the same three phases, each one a file in the repository:

1. **Spec** (`docs/.../specs/2026-10-16-step-3-family-design.md`): what the user sees, data model, rules, acceptance criteria as checkboxes. Written with the AI, **validated by me**.
2. **Plan** (`docs/.../plans/2026-10-16-step-3-family.md`): the ordered list of tasks to build it, each with its tests. Again a checklist.
3. **Build**: the AI works through the plan, ticking the boxes.

Writing them as files instead of chat messages changes everything:

- a new session (or a context reset) resumes from the files, not from a memory that's gone;
- I review a spec in two minutes, a diff of 2,000 lines in an hour. Catching a bad decision in the spec is the cheapest place to catch it;
- the checkboxes say exactly where we are.

### A skill that drives the process

Claude Code supports **skills**: markdown files describing a procedure, invoked with a slash command. I wrote `/gribilou-start`, whose job is just to know where the current step stands and propose the next phase:

| Situation                             | Phase             | Next action proposed      |
| ------------------------------------- | ----------------- | ------------------------- |
| Not on a `feature/step-*` branch      | No step started   | Start the next step       |
| On a step branch, no spec             | Spec to write     | Write the spec            |
| Spec exists, no plan                  | Plan to write     | Write the plan            |
| Plan with unchecked tasks             | Build in progress | Continue from first `[ ]` |
| Plan checked, spec criteria unchecked | Verification      | Checks, then device test  |
| Everything checked                    | End of step       | End the step              |

It detects the state from `git branch`, `git status` and the files, prints a short status, and asks one question. It **never chains two phases without asking**. That one rule is what kept me in charge of the project instead of watching it happen.

## After the features: tickets

### Where the tickets came from

On October 19 the six steps were merged. Then came the real work. In two days I had **42 tickets**, from three sources:

- **An end-to-end run** of the whole app on a small Android emulator, against the Firebase emulators. Sign out never finishes offline, the bottom bar hides the end of pages, the invite code is clipped by the Share button…
- **A code review of the whole app by the AI**, reading the code without running it. This one found the subtle bugs: a push notification lost for good when queueing a task fails, drawings queued offline that wait for the next app resume when the network comes back, a deleted account's name staying on their drawings. Each ticket was marked "read from the code, not yet reproduced": a review finding is a hypothesis.
- **My own feedback** on a real device, mostly style.

Each ticket is one small markdown file, with a type and an id: `B` for major bugs, `m` minor bugs, `S` style, `C` chores.

```md
# m15 · Queued drawings wait for the next app resume after the network comes back

**Found:** code review of 2026-10-20.
**Observed (expected from the code):** drawings saved offline are only sent at app start, on resume, after adding
a drawing, or from "Retry". If the network comes back while the app stays in the foreground, nothing is sent.
**Cause:** `PendingUploadsRunner.run()` has no connectivity trigger.
**Decision:** —
**Acceptance criteria:** —
```

*Decision* and *Acceptance criteria* stay empty until we agree on them.

### The ticket skill

`/gribilou-ticket m15` (or `/gribilou-ticket B6 B7 m12` for a batch) runs the whole life of a ticket. The core of the skill:

```md
A new screen, a data model change, new rules or more than a day of work is a feature: say so and stop.

## 2. Decide (validation 1)
- Bug: find the cause before any fix (read the code, reproduce with a throwaway test if needed).
- Propose in a few lines: cause, Decision (and what was ruled out), Acceptance criteria (each checked by
  a test or on device; for a bug, the test reproducing it), files touched.
Ask once: validate, amend, or drop. This validation authorizes everything up to the commit.

## 3. Do (no questions)
Test first: write the failing test, run it, see it fail for the right reason; then the smallest change.

## 4. Ship (validation 2)
analyze, tests, rules tests if firebase/ changed, then a code review of the diff.
Ask once: push, open the PR and squash-merge?
```

### Two validations, nothing in between

The key design choice: **exactly two questions per run.**

1. **Before any code**: here is the cause, the decision, the criteria. Validate?
2. **Before anything leaves my machine**: here is what changed, what's tested, what I couldn't check. Push and merge?

Between the two, the agent doesn't ask anything. It branches, writes the test, fixes, runs the checks, reviews its own diff.

Two well-placed questions get a real answer. Twenty get "yes" without being read.

And the skill has explicit exits: a criterion it couldn't check, a failing check with no fix in scope, a review finding outside the ticket → it opens the PR **without merging** and says why.

### Test first, even for the AI

"Write the failing test, run it, see it fail for the right reason" is the most important line in the skill.

An AI is very good at writing a fix that looks right. A failing test proves the bug exists *as described*, and that the fix is what makes it pass.

Not every ticket deserves a fix, either. The review found that timeline paging could skip a drawing at a page boundary. True, but only for two drawings with the same date **and** the same creation time to the millisecond, and the fix meant rewriting and redeploying every composite index of the collection. The ticket became *Won't do*, with that reasoning written in its file. A decision you wrote down is one you don't have to make again.

For what a test can't cover, the skill uses Maestro flows on an emulator, and tells me what it can't test itself (real camera, push, purchases, Apple sign-in sheets) so I check those by hand.

The commit messages are a side benefit. The agent writes them from the ticket, so they explain the cause, not just the change:

```txt
fix: A batch push is lost for good when queueing the task fails (#37)

The receipt claimed before the enqueue is given back when queueing the batch
push fails, and the trigger fails so it is retried, instead of swallowing the
error and leaving a receipt that makes every later run skip the batch.
Everything the trigger does is idempotent, and a task queued twice still
sends one push.
```

## Keep it cheap

The first version of the ticket skill was long, used sub-agents and a planning plugin for each ticket, and burned a lot of tokens to fix a padding. Version two starts with:

```md
**Keep it cheap.** Read only what you need: grep the ticket's row in the index, read its file, then only the
code it touches. No subagents. Do not re-run a check that passed unless the code changed since.
```

The batch mode, which was a second skill, was merged into the first one. The two skills, about 170 lines together, became one of about 75. A skill is code too: it gets refactored.

## The cleanup

On October 22 I deleted almost all of it: the specs, the plans, the 42 tickets, both skills, the planning plugin's files. More than 8,000 lines of markdown.

They were scaffolding. The specs described how to build the app, and the code now says what the app does. Keeping them would mean keeping two sources of truth that drift apart. The decisions that matter live in the commit messages and in comments next to the code.

What stayed is the `CLAUDE.md`. It got shorter and more precise, because it's the only part that is still useful for the next change.

## What worked, what didn't

**Worked**

- Files over chat: specs, plans and tickets in the repo survive sessions and can be reviewed.
- Checkable rules in `CLAUDE.md`, with file names and the reason behind odd choices.
- Two validations: one on the decision, one before pushing.
- Test first. It's the best filter against plausible-but-wrong fixes.
- The AI as a reviewer of the whole codebase, with its findings treated as hypotheses.

**Didn't**

- Heavy process for small tickets: sub-agents and planning for a one-line fix cost a lot and add nothing.
- Taking every review finding as a bug to fix: some cost more than the problem they solve.

The AI wrote most of the lines. But the decisions (what to build, what's a bug, what's good enough to merge) were mine, and the process existed to keep it that way.
