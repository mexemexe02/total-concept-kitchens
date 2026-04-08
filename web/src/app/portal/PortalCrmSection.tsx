"use client";

import { useCallback, useEffect, useState } from "react";
import type { CrmLead, CrmLeadStatus } from "@/lib/crm-types";
import { CRM_LEAD_STATUSES } from "@/lib/crm-types";

const ta =
  "mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-cream";
const label = "text-sm font-medium text-charcoal dark:text-cream";
const hint = "mt-1 text-xs text-stone-500 dark:text-stone-500";
const section =
  "rounded-xl border border-stone-200 bg-stone-50/80 p-6 dark:border-stone-700 dark:bg-stone-900/40";
const h2 = "text-lg font-semibold text-charcoal dark:text-cream";

const statusLabel: Record<CrmLeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
  on_hold: "On hold",
};

/**
 * Simple file-backed CRM for Ethan: add/edit kitchen leads manually.
 * Data lives in `content/crm-leads.json` (not auto-filled from Pantry).
 */
export function PortalCrmSection() {
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftPhone, setDraftPhone] = useState("");
  const [draftProject, setDraftProject] = useState("");
  const [draftNext, setDraftNext] = useState("");
  const [draftSource, setDraftSource] = useState("");
  const [draftStatus, setDraftStatus] = useState<CrmLeadStatus>("new");
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/portal/crm");
    if (res.status === 401) {
      setErr("Session expired — refresh the page and sign in again.");
      setLeads([]);
      setLoading(false);
      return;
    }
    if (!res.ok) {
      setErr("Could not load leads.");
      setLeads([]);
      setLoading(false);
      return;
    }
    const j = (await res.json()) as { leads?: CrmLead[] };
    setLeads(j.leads ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftName.trim()) return;
    setAdding(true);
    setMsg(null);
    setErr(null);
    const res = await fetch("/api/portal/crm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: draftName.trim(),
        email: draftEmail.trim() || null,
        phone: draftPhone.trim() || null,
        projectNote: draftProject.trim() || null,
        nextStep: draftNext.trim() || null,
        source: draftSource.trim() || null,
        status: draftStatus,
      }),
    });
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setErr(j.error ?? "Save failed");
      setAdding(false);
      return;
    }
    setDraftName("");
    setDraftEmail("");
    setDraftPhone("");
    setDraftProject("");
    setDraftNext("");
    setDraftSource("");
    setDraftStatus("new");
    setMsg("Lead added.");
    setAdding(false);
    await load();
  };

  const patchLead = async (id: string, partial: Partial<CrmLead>) => {
    setSavingId(id);
    setErr(null);
    const res = await fetch("/api/portal/crm", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...partial }),
    });
    const j = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) {
      setErr(j.error ?? "Update failed");
      setSavingId(null);
      return;
    }
    setSavingId(null);
    await load();
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Remove this lead from the list?")) return;
    setErr(null);
    const res = await fetch(`/api/portal/crm?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(j.error ?? "Delete failed");
      return;
    }
    setMsg("Lead removed.");
    await load();
  };

  return (
    <div className={`${section} border-bronze/30`}>
      <h2 className={h2}>2b · Leads (simple CRM)</h2>
      <p className={hint}>
        Your private list of prospects and jobs-in-progress — <strong className="font-medium text-charcoal dark:text-cream">you</strong> add
        rows (from calls, showroom, Instagram DMs, etc.). Pantry does <em>not</em> auto-create entries.
        File:{" "}
        <code className="rounded bg-stone-100 px-1 text-[11px] dark:bg-stone-800">content/crm-leads.json</code>{" "}
        — keep <code className="rounded bg-stone-100 px-1 text-[11px] dark:bg-stone-800">content/</code> writable on the server.
      </p>

      <form onSubmit={addLead} className="mt-4 space-y-3 rounded-lg border border-stone-200 bg-white/90 p-4 dark:border-stone-600 dark:bg-charcoal/60">
        <p className={`${label} !mt-0`}>Add lead</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={label}>Name / couple name *</span>
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              className={ta}
              required
              placeholder="e.g. Jordan Lee"
            />
          </label>
          <label className="block">
            <span className={label}>Email</span>
            <input
              type="email"
              value={draftEmail}
              onChange={(e) => setDraftEmail(e.target.value)}
              className={ta}
              placeholder="optional"
            />
          </label>
          <label className="block">
            <span className={label}>Phone</span>
            <input
              type="text"
              value={draftPhone}
              onChange={(e) => setDraftPhone(e.target.value)}
              className={ta}
              placeholder="optional"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>Project / interest</span>
            <textarea
              value={draftProject}
              onChange={(e) => setDraftProject(e.target.value)}
              rows={2}
              className={ta}
              placeholder="e.g. Full kitchen, cottage reno, spring timeline"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>Next step</span>
            <textarea
              value={draftNext}
              onChange={(e) => setDraftNext(e.target.value)}
              rows={2}
              className={ta}
              placeholder="e.g. Send quote by Friday · measure March 12"
            />
          </label>
          <label className="block">
            <span className={label}>Source</span>
            <input
              type="text"
              value={draftSource}
              onChange={(e) => setDraftSource(e.target.value)}
              className={ta}
              placeholder="referral, website, showroom…"
            />
          </label>
          <label className="block">
            <span className={label}>Status</span>
            <select
              value={draftStatus}
              onChange={(e) => setDraftStatus(e.target.value as CrmLeadStatus)}
              className={ta}
            >
              {CRM_LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {statusLabel[s]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="submit"
          disabled={adding}
          className="rounded-full bg-charcoal px-6 py-2 text-sm font-semibold text-cream hover:bg-bronze disabled:opacity-50 dark:bg-bronze dark:text-charcoal"
        >
          {adding ? "Adding…" : "Add lead"}
        </button>
      </form>

      {err ? <p className="mt-3 text-sm text-red-600 dark:text-red-400">{err}</p> : null}
      {msg ? <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">{msg}</p> : null}

      <div className="mt-6">
        <p className={label}>Your leads ({loading ? "…" : leads.length})</p>
        {loading ? (
          <p className={`${hint} !mt-2`}>Loading…</p>
        ) : leads.length === 0 ? (
          <p className={`${hint} !mt-2`}>No leads yet — add one above.</p>
        ) : (
          <ul className="mt-3 space-y-4">
            {leads.map((lead) => (
              <li
                key={lead.id}
                className="rounded-lg border border-stone-200 bg-white/90 p-4 dark:border-stone-600 dark:bg-charcoal/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <label className="block">
                      <span className={label}>Name</span>
                      <input
                        type="text"
                        defaultValue={lead.name}
                        key={`${lead.id}-nm-${lead.updatedAt}`}
                        onBlur={(e) => {
                          const v = e.target.value.trim();
                          if (v && v !== lead.name) patchLead(lead.id, { name: v });
                        }}
                        className={ta}
                      />
                    </label>
                    <p className="mt-1 text-xs text-stone-500">
                      Updated {new Date(lead.updatedAt).toLocaleString()} ·{" "}
                      <span className="font-mono text-[11px]">{lead.id}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteLead(lead.id)}
                    className="text-xs font-medium text-red-600 underline-offset-2 hover:underline dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <label className="block">
                    <span className={label}>Status</span>
                    <select
                      value={lead.status}
                      disabled={savingId === lead.id}
                      onChange={(e) =>
                        patchLead(lead.id, { status: e.target.value as CrmLeadStatus })
                      }
                      className={ta}
                    >
                      {CRM_LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {statusLabel[s]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className={label}>Source</span>
                    <input
                      type="text"
                      defaultValue={lead.source ?? ""}
                      key={`${lead.id}-src-${lead.updatedAt}`}
                      onBlur={(e) => {
                        const v = e.target.value.trim();
                        if (v !== (lead.source ?? "")) patchLead(lead.id, { source: v || null });
                      }}
                      className={ta}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={label}>Email</span>
                    <input
                      type="email"
                      defaultValue={lead.email ?? ""}
                      key={`${lead.id}-em-${lead.updatedAt}`}
                      onBlur={(e) => {
                        const v = e.target.value.trim();
                        if (v !== (lead.email ?? "")) patchLead(lead.id, { email: v || null });
                      }}
                      className={ta}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={label}>Phone</span>
                    <input
                      type="text"
                      defaultValue={lead.phone ?? ""}
                      key={`${lead.id}-ph-${lead.updatedAt}`}
                      onBlur={(e) => {
                        const v = e.target.value.trim();
                        if (v !== (lead.phone ?? "")) patchLead(lead.id, { phone: v || null });
                      }}
                      className={ta}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={label}>Project / interest</span>
                    <textarea
                      defaultValue={lead.projectNote ?? ""}
                      key={`${lead.id}-pj-${lead.updatedAt}`}
                      rows={2}
                      onBlur={(e) => {
                        const v = e.target.value.trim();
                        if (v !== (lead.projectNote ?? ""))
                          patchLead(lead.id, { projectNote: v || null });
                      }}
                      className={ta}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className={label}>Next step</span>
                    <textarea
                      defaultValue={lead.nextStep ?? ""}
                      key={`${lead.id}-nx-${lead.updatedAt}`}
                      rows={2}
                      onBlur={(e) => {
                        const v = e.target.value.trim();
                        if (v !== (lead.nextStep ?? "")) patchLead(lead.id, { nextStep: v || null });
                      }}
                      className={ta}
                    />
                  </label>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
