"use client";
export default function ConfirmDeleteModal({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
        <p className="mb-6">Are you sure you want to delete this user?</p>
        <div className="flex justify-end gap-3">
          <button className="btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="btn-ghost bg-red-600 text-white" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}