import { redirect } from "next/navigation";

// Redirect old dashboard to explore
export default function DashboardPage() {
  redirect("/explore");
}
