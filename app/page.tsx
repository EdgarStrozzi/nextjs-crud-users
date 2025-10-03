import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
export const dynamic = "force-dynamic";

function getBaseUrl() {
  // Vercel host
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  // Local dev
  const port = process.env.PORT ?? 3000;
  return `http://localhost:${port}`;
}

async function getUsers() {
  const base = getBaseUrl();
  const res = await fetch(`${base}/api/users`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return res.json();
}

export default async function Page() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Manage Users</h2>
          <p className="text-white/70">Create, view, update and delete users.</p>
        </div>
      </div>

      <UserForm />
      <UserTable initial={users} />
    </div>
  );
}
