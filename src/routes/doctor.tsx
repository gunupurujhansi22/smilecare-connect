import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/doctor")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/doctor-login" });
    return { user: data.user };
  },
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: () => <Outlet />,
});
