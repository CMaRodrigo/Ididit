<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- App state lives in `src/lib/proof/store.tsx` (local, persisted in the browser) — swap its internals for the backend later without touching pages.
- AI roles (Goal Architect, AI Judge) live behind the contracts in `src/lib/proof/ai.ts`; the Judge only evaluates against locked criteria and never rewrites them.
- Money movement goes only through the `StakeProvider` interface in `src/lib/proof/payments.ts`; the UI never pretends funds moved.
- Trophies are generated only through `badgeGenerator` in `src/lib/proof/badges.ts` (one per passed commitment, never for failed ones) — keeps the AI badge contract swappable.
- Supplied demo challenges carry an explicit demo flag; dates are illustrative unless `datesFromDocuments` marks them as taken from attached proof, and per-objective stakes are simulated (no money ever moves) — distinguishes portfolio examples from real verified records.
- Shared contract tabs live in `src/components/proof/ContractRecord.tsx`; reflections are separate retrospective state, not locked criteria — keeps all challenge outcomes inspectable consistently.
- Demo trophy artwork is a static generated asset catalog consumed only by `badgeGenerator`; runtime badge generation remains the existing local contract — avoids implying a live AI integration.

- Public entry and legacy auth URLs redirect to the populated profile; the prototype has no authentication gate or logout surface — keeps account-only access explicit without implying real authentication.
- Persisted demo achievements refresh presentation from the trophy catalog while preserving record IDs — artwork and copy updates must not break existing proof links.
- "Meaning to me" replaces the displayed original goal and, like reflections, is editable personal context outside the locked contract; proof documents are owner-attached files (bundled assets for supplied records, IndexedDB via `src/lib/proof/documents.ts` for uploads) and never change verification status — keeps proof honest and swappable for real storage later.
