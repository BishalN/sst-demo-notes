import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: Dashboard1,
});

export function Dashboard1() {
  return (
    <DashboardLayout>
      <Button>Dashboard</Button>
    </DashboardLayout>
  );
}
