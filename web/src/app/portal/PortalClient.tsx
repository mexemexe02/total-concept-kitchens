"use client";

import { useCallback, useEffect, useState } from "react";
import type { PortalSettings } from "@/lib/mise-types";

/**
 * Password gate + simple editors for banner and Mise copy.
 * Saving writes `content/portal-settings.json` on the server (Node runtime).
 */
export function PortalClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PortalSettings>({
    announcementBanner: null,
    chatGreeting: null,
    chatFooterNote: null,
    updatedAt: null,
  });

  const load = useCallback(async () => {
    const res = await fetch("/api/portal/settings");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    if (!res.ok) {
      setErr("Could not load settings.");
      setAuthed(false);
      return;
    }
    const data = (await res.json()) as PortalSettings;
    setForm(data);
    setAuthed(true);
    setErr(null);
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
    await load();
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
      const res = await fetch("/api/portal/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          announcementBanner: form.announcementBanner,
          chatGreeting: form.chatGreeting,
          chatFooterNote: form.chatFooterNote,
        }),
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

  if (authed === null) {
    return <p className="text-stone-600 dark:text-stone-400">Loading…</p>;
  }

  if (!authed) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-800 dark:bg-charcoal">
        <h1 className="text-xl font-semibold text-charcoal dark:text-cream">Sign in</h1>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
          Owner portal — update the site banner and Mise chat text. Uses{" "}
          <code className="rounded bg-stone-100 px-1 text-xs dark:bg-stone-800">.env.local</code>{" "}
          password.
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-charcoal dark:text-cream">Site content</h1>
        <button
          type="button"
          onClick={logout}
          className="text-sm font-medium text-bronze underline-offset-2 hover:underline dark:text-bronze-light"
        >
          Sign out
        </button>
      </div>

      <form onSubmit={save} className="space-y-6 rounded-2xl border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-800 dark:bg-charcoal">
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Changes save to <code className="rounded bg-stone-100 px-1 text-xs dark:bg-stone-800">content/portal-settings.json</code> on this server. On read-only hosting, mount a writable volume or sync this file from deploy artifacts.
        </p>

        <label className="block">
          <span className="text-sm font-medium text-charcoal dark:text-cream">
            Announcement banner (plain text, one line)
          </span>
          <textarea
            value={form.announcementBanner ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                announcementBanner: e.target.value || null,
              }))
            }
            rows={2}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-cream"
            placeholder="Optional — e.g. Now booking spring installs"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-charcoal dark:text-cream">
            Mise chat — opening greeting
          </span>
          <textarea
            value={form.chatGreeting ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, chatGreeting: e.target.value || null }))
            }
            rows={4}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-cream"
            placeholder="Leave blank to use the default Mise greeting."
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-charcoal dark:text-cream">
            Mise chat — footer note (small text under the input)
          </span>
          <textarea
            value={form.chatFooterNote ?? ""}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                chatFooterNote: e.target.value || null,
              }))
            }
            rows={2}
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm dark:border-stone-600 dark:bg-stone-900 dark:text-cream"
          />
        </label>

        {form.updatedAt ? (
          <p className="text-xs text-stone-500">Last saved: {form.updatedAt}</p>
        ) : null}
        {err ? <p className="text-sm text-red-600 dark:text-red-400">{err}</p> : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-charcoal px-8 py-3 text-sm font-semibold text-cream hover:bg-bronze disabled:opacity-50 dark:bg-bronze dark:text-charcoal"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
