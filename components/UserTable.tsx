"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EditUserModal from "./EditUserModal";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "User" | "Admin";
  createdAt?: string;
};

export default function UserTable({ initial }: { initial: User[] }) {
  const [editing, setEditing] = useState<User | null>(null);
  const router = useRouter();

  async function remove(id: string) {
    const ok = confirm("Delete this user?");
    if (!ok) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh(); // 🔑 refresh server data
    } else {
      alert("Failed to delete");
    }
  }

  return (
    <div className="card p-0 overflow-hidden">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {initial.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-10 text-white/60">
                No users yet. Add one above.
              </td>
            </tr>
          )}
          {initial.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td className="text-white/80">{u.email}</td>
              <td>
                <span className="px-2 py-1 rounded-md text-sm bg-white/10 border border-white/10">
                  {u.role}
                </span>
              </td>
              <td className="text-right">
                <div className="flex gap-2 justify-end">
                  <button className="btn-ghost" onClick={() => setEditing(u)}>Edit</button>
                  <button className="btn-ghost" onClick={() => remove(u._id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <EditUserModal user={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}