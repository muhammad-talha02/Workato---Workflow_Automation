import AuthLayout from "@/features/auth/components/auth-layout";
import { notRequiedAuth } from "@/lib/better-auth/auth-utils";
import { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  await notRequiedAuth();
  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
