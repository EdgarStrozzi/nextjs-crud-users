"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EditUserModal from "./EditUserModal";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { useToast } from "../components/Toast";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "User" | "Admin";
};

export default function UserTable({ initial }: { initial: User[] }) {
  const [editing, setEditing] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  const router = useRouter();
  const toast = useToast();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;

  // Search/filter
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "User" | "Admin">("All");

  const filtered = initial.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  // Sort
  const [sortField, setSortField] = useState<"name" | "email" | "role">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  function handleSort(field: "name" | "email" | "role") {
    if (field === sortField) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  function sortFn(a: User, b: User) {
    const valA = a[sortField].toString().toLowerCase();
    const valB = b[sortField].toString().toLowerCase();
    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  }

  const currentUsers = filtered.sort(sortFn).slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / usersPerPage);

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  async function handleDelete(user: User) {
    try {
      const res = await fetch(`/api/users/${user._id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        toast(data?.error || "Failed to delete", "error");
        throw new Error(data?.error || "Failed to delete user");
      }
      toast("User deleted");
      setConfirmDelete(null);
      router.refresh();
    } catch (err) {
      toast((err as Error).message || "Failed to delete", "error");
    }
  }

  return (
    <div className="card p-0 overflow-hidden">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        {/* Search: wider */}
        <input
          type="text"
          placeholder="Search by name/email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input w-full sm:w-[480px] md:w-[560px] lg:w-[640px]"
        />

        {/* Role: compact */}
        <div className="flex items-center gap-2">
          <label className="text-sm opacity-70">Role</label>
          <select
            className="select w-28"
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value as "All" | "User" | "Admin")
            }
          >
            <option value="All">All</option>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      <table className="table table-fixed w-full">
        <colgroup>
          <col className="w-[34%]" />
          <col className="w-[36%]" />
          <col className="w-[12%]" />
          <col className="w-[18%]" />
        </colgroup>
        <thead>
          <tr>
            <th className="cursor-pointer align-middle" onClick={() => handleSort("name")}>
              Name {sortField === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th className="cursor-pointer align-middle" onClick={() => handleSort("email")}>
              Email {sortField === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th className="cursor-pointer align-middle" onClick={() => handleSort("role")}>
              Role {sortField === "role" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th className="text-right align-middle">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((u) => (
            <tr key={u._id}>
              {/* Name + avatar */}
              <td className="align-middle">
                <span className="inline-flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-sm font-bold">
                    {getInitials(u.name)}
                  </span>
                  <span className="truncate max-w-[220px]">{u.name}</span>
                </span>
              </td>

              {/* Email + copy */}
              <td className="align-middle">
                <span className="inline-flex items-center gap-2 text-white/80">
                  <span className="truncate max-w-[320px]">{u.email}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(u.email)}
                    className="p-1 hover:bg-white/10 rounded"
                    title="Copy email"
                    aria-label={`Copy ${u.email}`}
                  >
                    <ClipboardIcon className="w-4 h-4" />
                  </button>
                </span>
              </td>

              {/* Role */}
              <td className="align-middle">
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    u.role === "Admin"
                      ? "bg-purple-500/20 text-purple-300"
                      : "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  {u.role}
                </span>
              </td>

              {/* Actions */}
              <td className="text-right align-middle">
                <div className="inline-flex gap-2">
                  <button className="btn-ghost" onClick={() => setEditing(u)}>
                    Edit
                  </button>
                  <button
                    className="btn-ghost text-red-400"
                    onClick={() => setConfirmDelete(u)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center p-4">
        <button
          className="btn-ghost"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="btn-ghost"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {editing && <EditUserModal user={editing} onClose={() => setEditing(null)} />}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="card bg-neutral-800 p-6 space-y-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-red-400">Confirm Delete</h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold">{confirmDelete.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button className="btn-ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
              <button
                className="btn-primary bg-red-500 hover:bg-red-600"
                onClick={() => handleDelete(confirmDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}