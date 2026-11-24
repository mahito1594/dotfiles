---
name: sakubun
description: "Guidelines for writing, updating, and restructuring readable structured documents—such as READMEs, design docs, specifications, guides, runbooks, and notes with headings, lists, tables, or diagrams—for both people and LLMs. Use this skill when creating a new structured document, adding sections to an existing doc, or rewriting/organizing a doc for readability—for example when the user says 'write a README', 'document this design', 'update the guide', '設計書を書いて', 'ドキュメントを整理して', 'READMEを更新して', '手順書を作って', '読みやすく書き直して', or invokes '/sakubun'. Do NOT trigger for short conversational answers, quick Q&A replies, commit messages, short PR descriptions, or inline code comments."
---

# Sakubun — Writing Structured Documents

These guidelines apply to structured documents—text organized with
headings, lists, tables, or diagrams. Their goal is to make documents
easy to scan and unambiguous for both people and LLMs. When a few
sentences of plain prose read more clearly than headings or lists,
prefer prose.

## Workflow

1. **Before writing**: Identify the primary reader and purpose. If they
   are unclear from the request or existing context, state your
   assumption in one line in your reply before writing (not inside the
   document).
2. **While writing or updating**: Follow the guidelines below. When
   editing an existing living document, integrate changes in logical
   order rather than appending them at the end.
3. **Before finishing**: Check each section against its heading, verify
   that lists and parallel items are consistent without artificial
   padding, and ensure notation and diagrams fit where the document will
   be read.

## Guidelines

### Decide the reader and their purpose first

Before writing, identify who will read the document and what they will
do with it; that purpose determines what belongs in the main text and
what should stay out of the way. People and LLMs often read the same
document for different reasons. Put what serves the primary reader in
the main text. Details that only some readers need—such as the date a
fact was verified or the source location that backs it up—should be
easy to skip: brief, visually distinct, and placed where they do not
interrupt a sentence.

When the reader or purpose is not clear from the request or existing
context, do not guess silently. State your assumed reader and purpose in
one line in your reply before writing (not inside the document itself),
so the requester can correct you right away.

### Place evidence where it does not interrupt the claim

When a claim needs supporting evidence, inserting it in parentheses
mid-sentence forces the reader to hold the unfinished claim in mind
until the parentheses close. On the other hand, moving all evidence to
a distant section or separate file makes it easy for later edits to
update a claim without updating its source, so the two drift apart.

When evidence is brief, place it at the end of the same item. If it is
long or shared across several items, keep the claim readable by using a
link, footnote, or collapsible block while keeping the mapping to each
claim clear.

### Answer the question the heading raises

A heading sets an expectation: "Pitfalls" tells the reader to expect
traps; "Design decisions" tells them to expect reasons why things were
built that way. When a section answers a different question—such as
maintenance steps under an architecture heading, or new requirements
inside a table of design rationales—readers keep scanning for the answer
they came for.

After writing a section, check that its content matches the heading. If
it does not, either move the mismatched material or rewrite the heading
to fit. Prefer headings a first-time reader will recognize over terms
coined while writing.

### Keep each list to one kind of item

A bulleted list signals that its items are the same kind of thing. When
unrelated kinds share one list—such as a benefit, a constraint, and a
workaround, or an output, a component, and a CLI option—readers have to
figure out what each item represents one by one. This holds for
single-line items just as much as for long ones.

Make every item in a list the same kind of thing, and name that kind in
the heading or lead-in sentence. Avoid splitting a few brief notes into
many single-item lists or tiny subsections; when items do not form a
clean parallel group, write them as prose instead. The same applies to
steps that cause or depend on one another—write them as a numbered
sequence or prose. Use a table when each cell stays brief and column
headings help readers compare rows; do not force long prose into table
cells.

### Give parallel items the same structure

When parallel items run to several sentences, readers expect each item
to follow the same structure. If the structure shifts from item to item,
readers have to re-parse the layout every time—and announcing the
pattern up front does not help unless the items actually follow it.

Present the core elements in the same order across parallel items.
Never fill an unknown fact with a guess, because a guess reads like a
confirmed fact; when a core fact is unknown, mark it as unverified or
unknown. At the same time, omit elements that simply do not apply rather
than padding every item with "None" or "N/A". If items fundamentally
cannot share a core structure, they are probably not parallel—reconsider
the layout, for example by splitting the section.

### Use custom notation consistently

Readers infer what a symbol or formatting convention means from its
first use and carry that expectation through the rest of the document.
For example, if you use `->` to show transitions between steps,
switching to another marker later looks like a different relationship,
and reusing `->` for side notes or consequences blurs its meaning.

Within a document, use one notation for each relationship you introduce
(such as branches, transitions, or annotations), and do not repurpose it
for another meaning. Stick to standard Markdown where possible rather
than inventing extra symbols.

### Diagram flows with complex merges or loops

A numbered list works well for a linear path, simple early exits,
branches that rejoin at the next step, or a single straightforward retry
loop. When multiple branches rejoin far from where they split or loops
cross several steps, forcing readers to track jumps like "go to step 7"
in their head becomes hard to follow—use a diagram instead.

Choose a diagram format suited to where the document will be read:
Mermaid renders as raw source where unsupported, and box-drawing text
breaks without a monospace font. Avoid box-drawing layouts with boxes or
columns whenever the labels include full-width (e.g., Japanese)
characters, as alignment breaks even in monospace fonts.

### Keep logical order when updating living documents

When a reference document or specification grows through repeated edits,
appending new material at the end organizes it by when things were
written rather than how they relate. A caveat ends up separated from the
rule it qualifies, and an outdated note lingers alongside the decision
that replaced it.

Place new material next to what it relates to, and when new information
narrows or corrects an existing statement, revise that statement in
place. This applies to living documents that describe the current state;
keep chronological order intact in logs, changelogs, meeting notes, and
decision records (ADRs).

### Follow the intent of a rule, not its letter

When a document sets a formatting rule such as "one item per line,"
preserve the readability it is meant to protect rather than obeying its
wording mechanically. Cramming several ideas onto one line with
separators obeys the rule while defeating its purpose. When content does
not fit a rule, rethink the structure or propose revising the rule
instead of forcing it in.

Apply this principle to these guidelines as well: if following a rule
here makes a passage more fragmented, repetitive, or harder to read,
prioritize readability. When you write a rule of your own, state what it
protects—a rule without a stated reason tends to be followed only to the
letter by future contributors.
