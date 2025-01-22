// app/admin/users/page.tsx
import { UsersTable } from "@/components/admin/UsersTable";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>
      <UsersTable />
    </div>
  );
}
