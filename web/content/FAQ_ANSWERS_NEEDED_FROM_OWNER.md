# FAQ copy Ethan should own or approve

Pantry’s generated FAQ (`src/data/mise-faq.json`, built from `scripts/generate-mise-faq.mjs`) uses **generic, non-binding** language for anything shop-specific. The bot should **not** invent precise policies.

**Starter rows:** `content/mise-custom-faq.json` now ships with **eight** policy-style Q&As (payment, warranty, insurance, consult fee, owner-supplied items, financing, minimum scope, permits). They deliberately **defer to Ethan** and written scope — **replace or tighten** them in **`/portal` → Pantry custom Q&A** with your real terms when ready.

Use this checklist to supply **short, accurate** answers (or “we don’t offer X”) so Ethan can update **portal custom Q&A** (`content/mise-custom-faq.json`) or adjust generator text in `generate-mise-faq.mjs` after you sign off.

## High priority (legal, money, risk)

| Topic | Why it needs you |
|--------|-------------------|
| **Deposit / payment schedule** | Percentages, milestones, and “when balance is due” must match your contracts. |
| **Consultation fee** | Free vs paid, travel charges, what the first meeting includes. |
| **Written quote validity** | How long a price quote stays open. |
| **Change orders** | How changes are priced, approved, and scheduled. |
| **Warranty** | Workmanship vs manufacturer; duration; what is excluded; who to call first. |
| **Insurance / COI** | Liability, WSIB (if applicable), naming additional insured — what you actually carry. |
| **Permits** | Whether TCK pulls permits, owner pulls, or hybrid; typical fees/timing (ballpark only if comfortable). |
| **Financing** | Whether you partner with a lender or are cash/cheque/card only — never invent third-party terms. |

## Operations & scope

| Topic | Why it needs you |
|--------|-------------------|
| **Minimum job / cabinet-only** | Smallest project you’ll take; kitchen-only vs whole-home rules. |
| **Customer-supplied materials** | Counters, appliances, fixtures — what you allow and how warranty works. |
| **Subcontractors vs employees** | Who is on site; how you vet trades (only state what you’re happy to publish). |
| **Typical lead times *for your shop*** | Generic “weeks to months” is in FAQ; your **usual** ranges are better if stable. |
| **Service area edge cases** | Towns you always serve vs “call to confirm”; cottage / seasonal access. |
| **Showroom / visits** | Address, hours, appointment-only vs walk-in. |
| **Site hours & noise** | Default work hours; how you handle neighbor or condo rules. |
| **Cleanup & disposal** | Dumpster, bin, haul-away — who pays and what’s included. |

## After install

| Topic | Why it needs you |
|--------|-------------------|
| **Punch list / callbacks** | How long after install you’ll adjust doors; what counts as normal seasonal movement vs a service call. |
| **Care instructions** | Links or PDFs for finishes you sell — better than generic web advice. |

## What the FAQ already does safely

- **Educational** design and construction concepts (layout, materials, sequence) without promising your exact process.
- **“Ask Ethan / Contact page / written scope”** for anything that varies by job.

When in doubt, add a row to **custom Q&A** in the portal with your exact wording — those rows are matched **before** the big generated bank.
