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
  const currentUsers = initial.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(initial.length / usersPerPage);

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