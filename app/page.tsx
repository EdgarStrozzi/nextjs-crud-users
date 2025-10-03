import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";

async function getUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/users`, {
    // In Next.js App Router, `fetch` defaults to caching on the server.
    // `no-store` forces fresh data on each request.
    cache: "no-store",
  });
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
