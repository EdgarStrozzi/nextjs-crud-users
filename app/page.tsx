import UserForm from "../components/UserForm";
import UserTable from "../components/UserTable";
import { dbConnect } from "../lib/mongodb";
import User from "../models/User";

export const revalidate = 0; 

async function getUsersDirect() {
  await dbConnect();

  const rows = await User.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(rows));
}

export default async function Page() {
  const users = await getUsersDirect();

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