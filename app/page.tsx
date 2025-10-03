import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";

// allow no-store on server
export const revalidate = 0; 

async function getUsers() {
  const res = await fetch("/api/users", {
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