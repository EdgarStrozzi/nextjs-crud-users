"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useToast } from "../components/Toast";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "User" | "Admin";
};

type Props = { user: User; onClose: () => void; };

const Schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["User", "Admin"]),
});

export default function EditUserModal({ user, onClose }: Props) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState<"User" | "Admin">(user?.role ?? "User");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const toast = useToast();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setRole((user?.role as "User" | "Admin") ?? "User");
    setError("");
  }, [user]);

  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!user) return null;

  async function save() {
    setError("");
    setSaving(true);
    try {
      const clean = Schema.parse({ name: name.trim(), email: email.trim().toLowerCase(), role });
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clean),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = String(data?.error || "Failed to update");
        toast(msg, "error");
        setError(msg);
        return;
      }
      toast("User updated");
      onClose();
      router.refresh();
    } catch (e: any) {
      const msg = e?.issues?.[0]?.message || e?.message || "Validation error";
      setError(msg);
      toast(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidName = name.trim().length > 0;
  const disabled = saving || !isValidName || !isValidEmail;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className="card bg-neutral-800 p-6 w-full max-w-md"
      >
        <h3 className="text-lg font-semibold mb-4">Edit User</h3>

        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1 opacity-80">Name</label>
            <input
              className="input w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!isValidName}
            />
            {!isValidName && (
              <p className="mt-1 text-xs text-red-400">Name is required.</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1 opacity-80">Email</label>
            <input
              className="input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              aria-invalid={!isValidEmail}
            />
            {!isValidEmail && email.length > 0 && (
              <p className="mt-1 text-xs text-red-400">Invalid email.</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1 opacity-80">Role</label>
            <select
              className="select w-full"
              value={role}
              onChange={(e) => setRole(e.target.value as "User" | "Admin")}
            >
              <option>User</option>
              <option>Admin</option>
            </select>
          </div>
        </div>

        {error && <div className="mt-3 text-sm text-red-400">{error}</div>}

        <div className="mt-6 flex gap-3 justify-end">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary disabled:opacity-60" onClick={save} disabled={disabled}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}