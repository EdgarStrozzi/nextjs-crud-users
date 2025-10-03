"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EditUserModal from "./EditUserModal";

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

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "User" | "Admin">("All");

  const filtered = initial.filter((u) => {
    const matchesQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const [sortField, setSortField] = useState<"name" | "email" | "role">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const currentUsers = filtered
    .sort(sortFn) // <-- we’ll add this in Step 3
    .slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / usersPerPage);

  async function handleDelete(user: User) {
    try {
      const res = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setConfirmDelete(null); // close modal
      router.refresh(); // refresh table
    } catch (err) {
      alert((err as Error).message);
    }
  }

  function handleSort(field: "name" | "email" | "role") {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
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

  return (
    <div className="card p-0 overflow-hidden">
            <div className="flex gap-4 p-4 items-center">
      <input
        type="text"
        placeholder="Search by name/email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="input flex-1"
      />
      <select
        className="select"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value as "All" | "User" | "Admin")}
      >
        <option value="All">All</option>
        <option value="User">User</option>
        <option value="Admin">Admin</option>
      </select>
    </div>
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")} className="cursor-pointer">Name</th>
            <th onClick={() => handleSort("email")} className="cursor-pointer">Email</th>
            <th onClick={() => handleSort("role")} className="cursor-pointer">Role</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td className="text-white/80">{u.email}</td>
              <td>{u.role}</td>
              <td className="text-right">
                <div className="flex gap-2 justify-end">
                  <button
                    className="btn-ghost"
                    onClick={() => setEditing(u)}
                  >
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

      {/* Pagination controls */}
      <div className="flex justify-between items-center p-4">
        <button
          className="btn-ghost"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn-ghost"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {editing && (
        <EditUserModal user={editing} onClose={() => setEditing(null)} />
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="card bg-neutral-800 p-6 space-y-4 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-red-400">
              Confirm Delete
            </h3>
            <p>
              Are you sure you want to delete{" "}
              <span className="font-bold">{confirmDelete.name}</span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="btn-ghost"
                onClick={() => setConfirmDelete(null)}
              >
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