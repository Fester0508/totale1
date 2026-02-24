import { UsersTable } from "@/components/admin/users-table";

export default function UtentiListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Utenti</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestisci gli utenti registrati
        </p>
      </div>
      <UsersTable />
    </div>
  );
}
