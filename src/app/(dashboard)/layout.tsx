import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="d-flex">
      <Sidebar user={session.user} />
      <main className="main-content flex-grow-1">{children}</main>
    </div>
  );
}
