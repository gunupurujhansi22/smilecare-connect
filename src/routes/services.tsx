import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";

export const Route = createFileRoute("/services")({
  component: () => <Outlet />,
});

export function useIsServicesIndex() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return pathname === "/services";
}
