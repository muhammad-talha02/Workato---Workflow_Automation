import { notRequiedAuth } from "@/lib/better-auth/auth-utils";
import { ReactNode } from "react";

const Authlayout = async ({ children }: { children: ReactNode }) => {
  await notRequiedAuth();
  return <>{children}</>;
};

export default Authlayout;
