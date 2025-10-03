"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, role })
      });
      if (!res.ok) throw new Error("Failed to create user");
      setName(""); setEmail(""); setRole("User");
      router.refresh();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card p-6 space-y-4">
      <h2 className="text-lg font-semibold">Add New User</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="input" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required/>
        <input className="input" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
        <select className="select" value={role} onChange={(e)=>setRole(e.target.value)}>
          <option>User</option>
          <option>Admin</option>
        </select>
      </div>
      <button className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Create User"}
      </button>
    </form>
  )
}
