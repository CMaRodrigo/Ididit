import { useRef, useState } from "react";
import { FileUp, Github, Link2, Type, Video, X } from "lucide-react";
import type { Evidence } from "@/lib/proof/types";
import { uid } from "@/lib/proof/format";
import { cn } from "@/lib/utils";

type Kind = "url" | "github" | "file" | "text";

const KINDS: { id: Kind; label: string; icon: typeof Link2; ph: string }[] = [
  { id: "url", label: "URL", icon: Link2, ph: "https://meuportfolio.com" },
  { id: "github", label: "GitHub", icon: Github, ph: "github.com/alex/portfolio" },
  { id: "file", label: "Arquivo", icon: FileUp, ph: "" },
  { id: "text", label: "Nota", icon: Type, ph: "Explique brevemente o que isto mostra" },
];

/**
 * Collects evidence for one criterion. Files are referenced by name for now;
 * a storage bucket upload would plug in at `onFile`.
 */
export function EvidenceUploader({ criterionId, items, onChange }: { criterionId: string; items: Evidence[]; onChange: (e: Evidence[]) => void }) {
  const [kind, setKind] = useState<Kind>("url");
  const [val, setVal] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const add = (type: Kind, value: string) => {
    if (!value.trim()) return;
    onChange([...items, { id: uid("evd"), criterionId, type, value: value.trim(), submittedAt: new Date().toISOString() }]);
    setVal("");
  };

  return (
    <div>
      {items.length > 0 && (
        <ul className="mb-3 space-y-1.5">
          {items.map((e) => {
            const K = KINDS.find((k) => k.id === e.type)!;
            const isVid = /\.(mp4|mov|webm)$/i.test(e.value);
            const Icon = isVid ? Video : K.icon;
            return (
              <li key={e.id} className="flex items-center gap-2.5 rounded-md bg-secondary px-3 py-2 text-sm">
                <Icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{e.value}</span>
                <button onClick={() => onChange(items.filter((x) => x.id !== e.id))} className="text-muted-foreground hover:text-foreground" aria-label="Remover"><X className="size-3.5" /></button>
              </li>
            );
          })}
        </ul>
      )}
      <div className="flex items-stretch overflow-hidden rounded-lg border border-input bg-surface focus-within:border-foreground/40">
        <div className="flex border-r border-border">
          {KINDS.map((k) => (
            <button key={k.id} onClick={() => (k.id === "file" ? fileRef.current?.click() : setKind(k.id))} title={k.label} className={cn("grid w-9 place-items-center text-muted-foreground transition hover:text-foreground", kind === k.id && k.id !== "file" && "bg-secondary text-foreground")}>
              <k.icon className="size-4" />
            </button>
          ))}
        </div>
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add(kind, val)}
          placeholder={KINDS.find((k) => k.id === kind)!.ph}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm focus:outline-none"
        />
        <button onClick={() => add(kind, val)} disabled={!val.trim()} className="px-3.5 text-sm font-medium disabled:text-muted-foreground/50">Adicionar</button>
        <input ref={fileRef} type="file" accept="image/*,video/*,.pdf,.doc,.docx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) add("file", f.name); e.target.value = ""; }} />
      </div>
    </div>
  );
}
