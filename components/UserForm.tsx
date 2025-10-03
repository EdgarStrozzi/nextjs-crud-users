"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"User" | "Admin">("User");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();

  // simple email check
  const isValidEmail = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    [email]
  );
  const isValidName = useMemo(() => name.trim().length > 0, [name]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // client-side validation
    if (!isValidName) {
      setError("Name is required.");
      return;
    }
    if (!isValidEmail) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, role })
      });

      if (!res.ok) {
        
        const data = await res.json().catch(() => ({}));
        const msg = String(data?.error || "Failed to create user");

        if (/E11000/i.test(msg) || /duplicate key/i.test(msg)) {
          setError("That email is already registered. Try a different one.");
        } else {
          setError(msg);
        }
        return;
      }

      // Success
      setName("");
      setEmail("");
      setRole("User");
      setSuccess("User created successfully.");
      router.refresh();
    } catch (err) {
      setError((err as Error).message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || !isValidName || !isValidEmail;

  return (
    <form
      id="add-user-form"
      onSubmit={onSubmit}
      className="card p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold">Add New User</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <input
            className="input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!isValidName}
            aria-describedby={!isValidName ? "name-error" : undefined}
          />
          {!isValidName && (
            <p id="name-error" className="mt-1 text-xs text-red-400">
              Name is required.
            </p>
          )}
        </div>

        <div>
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!isValidEmail}
            aria-describedby={!isValidEmail ? "email-error" : undefined}
          />
          {!isValidEmail && email.length > 0 && (
            <p id="email-error" className="mt-1 text-xs text-red-400">
              Enter a valid email address.
            </p>
          )}
        </div>

        <div>
          <select
            className="select"
            value={role}
            onChange={(e) => setRole(e.target.value as "User" | "Admin")}
          >
            <option>User</option>
            <option>Admin</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm text-green-400">
          {success}
        </div>
      )}

      <button className="btn-primary disabled:opacity-60" disabled={disabled}>
        {loading ? "Saving..." : "Create User"}
      </button>
    </form>
  );
}