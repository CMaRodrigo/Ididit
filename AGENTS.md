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
