"use client";

import { useCallback, useEffect, useState } from "react";
import type { PortalSettings } from "@/lib/mise-types";

/** One editable row in the Pantry custom FAQ editor (tags as comma-separated text). */
type MiseFaqEditorRow = { q: string; a: string; tags: string };
type PortalTextKey = Exclude<keyof PortalSettings, "chatEnabled" | "updatedAt">;
import { EMPTY_PORTAL_SETTINGS } from "@/lib/portal-defaults";
import { PORTAL_MUTABLE_KEYS } from "@/lib/portal-mutable-keys";

/**
 * Owner portal: edits `content/portal-settings.json` (banner, Pantry, hero, contact,
 * footer, hours, reviews link, private notes). Public site reads the same file server-side.
 */
export function PortalClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PortalSettings>({ ...EMPTY_PORTAL_SETTINGS });
  const [miseFaqRows, setMiseFaqRows] = useState<MiseFaqEditorRow[]>([]);
  const [miseFaqSaving, setMiseFaqSaving] = useState(false);
  const [miseFaqMsg, setMiseFaqMsg] = useState<string | null>(null);

  const setField = (key: PortalTextKey, value: string) => {
    setForm((f) => ({
      ...f,
      [key]: value.trim() === "" ? null : value,
    }));
  };
  const setBoolField = (key: keyof PortalSettings, value: boolean) => {
    setForm((f) => ({
      ...f,
      [key]: value,
    }));
  };

  /** @returns whether the session cookie is valid and settings loaded */
  const load = useCallback(async (): Promise<boolean> => {
    const [res, resFaq] = await Promise.all([
      fetch("/api/portal/settings"),
      fetch("/api/portal/mise-faq"),
    ]);
    if (res.status === 401) {
      setAuthed(false);
      return false;
    }
    if (!res.ok) {
      setErr("Could not load settings.");
      setAuthed(false);
      return false;
    }
    const data = (await res.json()) as PortalSettings;
    setForm(data);
    setAuthed(true);
    setErr(null);
    if (resFaq.ok) {
      const faqJson = (await resFaq.json()) as {
        entries?: Array<{ q: string; a: string; tags?: string[] }>;
      };
      const entries = faqJson.entries ?? [];
      setMiseFaqRows(
        entries.map((e) => ({
          q: e.q,
          a: e.a,
          tags: e.tags?.length ? e.tags.join(", ") : "",
        })),
      );
    } else {
      setMiseFaqRows([]);
    }
    return true;
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/portal/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(j.error ?? "Login failed");
      return;
    }
    setPassword("");
    const sessionOk = await load();
    if (!sessionOk) {
      setErr(
        "Password accepted but session did not stick. If you use HTTP with a production build, set TCK_PORTAL_COOKIE_INSECURE=true in Coolify (or open the site with HTTPS only). Restart the app after changing env.",
      );
    }
  };

  const logout = async () => {
    await fetch("/api/portal/logout", { method: "POST" });
    setAuthed(false);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const payload: Partial<PortalSettings> = {};
      const mutablePayload = payload as Record<string, string | boolean | null>;
      for (const key of PORTAL_MUTABLE_KEYS) {
        mutablePayload[key] = form[key];
      }
      const res = await fetch("/api/portal/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setErr(j.error ?? "Save failed");
        return;
      }
      const data = (await res.json()) as PortalSettings;
      setForm(data);
    } finally {
      setSaving(false);
    }
  };

  /** Persist Mise Q&A pairs to `content/mise-custom-faq.json` (separate from portal-settings). */
  const saveMiseFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setMiseFaqSaving(true);
    setMiseFaqMsg(null);
    setErr(null);
    try {
      const entries = miseFaqRows
        .map((r) => ({
          q: r.q.trim(),
          a: r.a.trim(),
          tags: r.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }))
        .filter((r) => r.q.length > 0 && r.a.length > 0);
      const res = await fetch("/api/portal/mise-faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setMiseFaqMsg(j.error ?? "Save failed");
        return;
      }
      const data = (await res.json()) as {
        entries?: Array<{ q: string; a: string; tags?: string[] }>;
      };
      const list = data.entries ?? [];
      setMiseFaqRows(
        list.map((row) => ({
          q: row.q,
          a: row.a,
          tags: row.tags?.length ? row.tags.join(", ") : "",
        })),
      );
      setMiseFaqMsg(`Saved ${list.length} pair(s).`);
    } finally {
      setMiseFaqSaving(false);
    }
  };

  if (authed === null) {
    return <p className="text-stone-600 dark:text-stone-400">Loading…</p>;
  }

  if (!authed) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-800 dark:bg-charcoal">
        <h1 className="text-xl font-semibold text-charcoal dark:text-cream">Sign in</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          Staff portal — edit live site copy (banner, home hero, contact, footer, Pantry, and
          more). Password is in server{" "}
          <code className="rounded bg-stone-100 px-1 text-xs dark:bg-stone-800">.env</code>.
        </p>
        <form onSubmit={login} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-charcoal dark:text-cream">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-cream"
              autoComplete="current-password"
            />
          </label>
          {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          <button
            type="submit"
            className="rounded-full bg-charcoal px-6 py-2.5 text-sm font-semibold text-cream hover:bg-bronze dark:bg-bronze dark:text-charcoal"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  const ta =
    "mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-cream";
  const label = "text-sm font-medium text-charcoal dark:text-cream";
  const hint = "mt-1 text-xs text-stone-500 dark:text-stone-500";
  const section =
    "rounded-xl border border-stone-200 bg-stone-50/80 p-6 dark:border-stone-700 dark:bg-stone-900/40";
  const h2 = "text-lg font-semibold text-charcoal dark:text-cream";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal dark:text-cream">
            Site content
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Site controls for Ethan — leave blank to keep default copy.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="self-start text-sm font-medium text-bronze underline-offset-2 hover:underline dark:text-bronze-light"
        >
          Sign out
        </button>
      </div>

      <form
        onSubmit={save}
        className="space-y-8 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-charcoal sm:p-8"
      >
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Saves to{" "}
          <code className="rounded bg-stone-100 px-1 text-xs dark:bg-stone-800">
            content/portal-settings.json
          </code>
          . Docker/Coolify needs a writable volume for that path if the container filesystem is
          read-only.
        </p>

        <div className={section}>
          <h2 className={h2}>1 · Site-wide banner</h2>
          <p className={hint}>Thin bar at the very top when filled — promos, closures, season.</p>
          <label className="mt-3 block">
            <span className={label}>Announcement (plain text)</span>
            <textarea
              value={form.announcementBanner ?? ""}
              onChange={(e) => setField("announcementBanner", e.target.value)}
              rows={2}
              className={ta}
              placeholder="e.g. Now booking spring installs"
            />
          </label>
        </div>

        <div className={section}>
          <h2 className={h2}>2 · Pantry chatbot</h2>
          <p className={hint}>Visitor-facing chat widget on every page.</p>
          <label className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2 dark:border-stone-700 dark:bg-stone-900/60">
            <span className={`${label} !mt-0`}>Enable Pantry on public pages</span>
            <input
              type="checkbox"
              checked={form.chatEnabled}
              onChange={(e) => setBoolField("chatEnabled", e.target.checked)}
              className="h-4 w-4 accent-bronze"
            />
          </label>
          <p className={hint}>
            Turn off to hide the widget and disable <code>/api/chat</code> replies.
          </p>
          <label className="mt-3 block">
            <span className={label}>Opening greeting</span>
            <textarea
              value={form.chatGreeting ?? ""}
              onChange={(e) => setField("chatGreeting", e.target.value)}
              rows={4}
              className={ta}
              placeholder="Leave blank for built-in greeting."
            />
          </label>
          <label className="mt-4 block">
            <span className={label}>Footer note under the input</span>
            <textarea
              value={form.chatFooterNote ?? ""}
              onChange={(e) => setField("chatFooterNote", e.target.value)}
              rows={2}
              className={ta}
            />
          </label>
          <p className={`${hint} mt-4`}>
            For exact question-and-answer pairs Pantry can match before the big generated FAQ, use{" "}
            <strong className="font-medium text-charcoal dark:text-cream">Pantry custom Q&A</strong>{" "}
            below the main form (separate save).
          </p>
        </div>

        <div className={section}>
          <h2 className={h2}>3–6 · Home page hero</h2>
          <p className={hint}>
            Main dark band on the homepage. Blank fields use the default marketing copy.
          </p>
          <label className="mt-3 block">
            <span className={label}>3 · Eyebrow (bronze line, e.g. Kitchen design · …)</span>
            <textarea
              value={form.heroEyebrow ?? ""}
              onChange={(e) => setField("heroEyebrow", e.target.value)}
              rows={2}
              className={ta}
            />
          </label>
          <label className="mt-3 block">
            <span className={label}>4 · Headline (large title)</span>
            <textarea
              value={form.heroHeadline ?? ""}
              onChange={(e) => setField("heroHeadline", e.target.value)}
              rows={2}
              className={ta}
            />
          </label>
          <label className="mt-3 block">
            <span className={label}>5 · Supporting paragraph</span>
            <textarea
              value={form.heroSupporting ?? ""}
              onChange={(e) => setField("heroSupporting", e.target.value)}
              rows={4}
              className={ta}
            />
          </label>
          <label className="mt-3 block">
            <span className={label}>6 · Trust line (short services list)</span>
            <textarea
              value={form.heroTrustLine ?? ""}
              onChange={(e) => setField("heroTrustLine", e.target.value)}
              rows={2}
              className={ta}
            />
          </label>
        </div>

        <div className={section}>
          <h2 className={h2}>7 · Hours & availability</h2>
          <p className={hint}>
            Shown in the footer contact block (and replaces env hours when set). Example: Mon–Fri
            8am–5pm · By appointment.
          </p>
          <label className="mt-3 block">
            <span className={label}>Hours line</span>
            <textarea
              value={form.businessHoursLine ?? ""}
              onChange={(e) => setField("businessHoursLine", e.target.value)}
              rows={2}
              className={ta}
            />
          </label>
        </div>

        <div className={section}>
          <h2 className={h2}>8 · Reviews link</h2>
          <p className={hint}>
            Full URL to Google or Facebook reviews — adds “Leave us a review” under social
            icons in the footer.
          </p>
          <label className="mt-3 block">
            <span className={label}>Review page URL</span>
            <input
              type="url"
              value={form.reviewPageUrl ?? ""}
              onChange={(e) => setField("reviewPageUrl", e.target.value)}
              className={ta}
              placeholder="https://g.page/... or https://www.facebook.com/.../reviews"
            />
          </label>
        </div>

        <div className={section}>
          <h2 className={h2}>9 · Contact page</h2>
          <p className={hint}>The /contact route — subtitle and optional callout above the cards.</p>
          <label className="mt-3 block">
            <span className={label}>Subtitle under “Contact us”</span>
            <textarea
              value={form.contactPageIntro ?? ""}
              onChange={(e) => setField("contactPageIntro", e.target.value)}
              rows={3}
              className={ta}
              placeholder="Leave blank for default intro text."
            />
          </label>
          <label className="mt-3 block">
            <span className={label}>Extra note (highlight box above phone/email cards)</span>
            <textarea
              value={form.contactExtraNote ?? ""}
              onChange={(e) => setField("contactExtraNote", e.target.value)}
              rows={3}
              className={ta}
              placeholder="e.g. We typically reply within one business day."
            />
          </label>
        </div>

        <div className={section}>
          <h2 className={h2}>10 · Footer tagline + private notes</h2>
          <label className="mt-3 block">
            <span className={label}>Footer tagline (under company name)</span>
            <p className={hint}>Replaces the default one-liner when filled.</p>
            <textarea
              value={form.footerTagline ?? ""}
              onChange={(e) => setField("footerTagline", e.target.value)}
              rows={3}
              className={ta}
            />
          </label>
          <label className="mt-4 block">
            <span className={label}>Private notes (never shown on the public site)</span>
            <p className={hint}>
              Your checklist — launch todos, license numbers, reminders. Only visible here after
              sign-in.
            </p>
            <textarea
              value={form.ownerPrivateNotes ?? ""}
              onChange={(e) => setField("ownerPrivateNotes", e.target.value)}
              rows={6}
              className={ta}
            />
          </label>
        </div>

        {form.updatedAt ? (
          <p className="text-xs text-stone-500">Last saved: {form.updatedAt}</p>
        ) : null}
        {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-charcoal px-8 py-3 text-sm font-semibold text-cream hover:bg-bronze disabled:opacity-50 dark:bg-bronze dark:text-charcoal"
        >
          {saving ? "Saving…" : "Save all changes"}
        </button>
      </form>

      <form
        onSubmit={saveMiseFaq}
        className="space-y-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-charcoal sm:p-8"
      >
        <div>
          <h2 className="text-xl font-semibold text-charcoal dark:text-cream">
            11 · Pantry custom Q&A
          </h2>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            These pairs are merged <em>ahead</em> of the generated FAQ so visitors get your wording
            when the match is strong enough. Empty rows are dropped on save.
          </p>
          <p className="mt-2 text-xs text-stone-500 dark:text-stone-500">
            File:{" "}
            <code className="rounded bg-stone-100 px-1 dark:bg-stone-800">
              content/mise-custom-faq.json
            </code>
            — same writable volume note as portal settings.
          </p>
        </div>

        <div className="space-y-6">
          {miseFaqRows.length === 0 ? (
            <p className="text-sm text-stone-500 dark:text-stone-500">No custom pairs yet.</p>
          ) : null}
          {miseFaqRows.map((row, i) => (
            <div
              key={i}
              className="rounded-xl border border-stone-200 bg-stone-50/80 p-4 dark:border-stone-700 dark:bg-stone-900/40"
            >
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setMiseFaqRows((rows) => rows.filter((_, j) => j !== i))
                  }
                  className="text-xs font-medium text-red-600 underline-offset-2 hover:underline dark:text-red-400"
                >
                  Remove
                </button>
              </div>
              <label className="block">
                <span className={label}>Question (what visitors might type)</span>
                <textarea
                  value={row.q}
                  onChange={(e) =>
                    setMiseFaqRows((rows) =>
                      rows.map((r, j) => (j === i ? { ...r, q: e.target.value } : r)),
                    )
                  }
                  rows={2}
                  className={ta}
                  placeholder="e.g. Do you install outside the city?"
                />
              </label>
              <label className="mt-3 block">
                <span className={label}>Answer (Pantry will add a short opener in front)</span>
                <textarea
                  value={row.a}
                  onChange={(e) =>
                    setMiseFaqRows((rows) =>
                      rows.map((r, j) => (j === i ? { ...r, a: e.target.value } : r)),
                    )
                  }
                  rows={4}
                  className={ta}
                />
              </label>
              <label className="mt-3 block">
                <span className={label}>Tags (optional, comma-separated)</span>
                <input
                  type="text"
                  value={row.tags}
                  onChange={(e) =>
                    setMiseFaqRows((rows) =>
                      rows.map((r, j) => (j === i ? { ...r, tags: e.target.value } : r)),
                    )
                  }
                  className={ta}
                  placeholder="service-area, install"
                />
              </label>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              setMiseFaqRows((rows) => [...rows, { q: "", a: "", tags: "" }])
            }
            className="rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-charcoal hover:bg-stone-50 dark:border-stone-600 dark:text-cream dark:hover:bg-stone-800"
          >
            Add pair
          </button>
          <button
            type="submit"
            disabled={miseFaqSaving}
            className="rounded-full bg-charcoal px-8 py-2.5 text-sm font-semibold text-cream hover:bg-bronze disabled:opacity-50 dark:bg-bronze dark:text-charcoal"
          >
            {miseFaqSaving ? "Saving…" : "Save Pantry Q&A"}
          </button>
        </div>
        {miseFaqMsg ? (
          <p className="text-sm text-stone-600 dark:text-stone-400">{miseFaqMsg}</p>
        ) : null}
      </form>
    </div>
  );
}
