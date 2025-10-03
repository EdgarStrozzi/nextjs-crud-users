"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = { user: any | null; onClose: () => void; };

export default function EditUserModal({ user, onClose }: Props) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState(user?.role ?? "User");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setRole(user?.role ?? "User");
  }, [user]);

  if (!user) return null;

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role })
      });
      if (!res.ok) throw new Error("Failed to update");
      router.refresh();
      onClose();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={(e)=>{ if(e.target===e.currentTarget) onClose(); }}>
      <div className="modal">
        <h3 className="text-lg font-semibold mb-4">Edit User</h3>
        <div className="space-y-3">
          <input className="input" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="input" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <select className="select" value={role} onChange={(e)=>setRole(e.target.value)}>
            <option>User</option>
            <option>Admin</option>
          </select>
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
