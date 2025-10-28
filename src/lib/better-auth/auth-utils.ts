import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const getAuthSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
};

export const requiredAuth = async () => {
  const session = await getAuthSession();

  if (!session) {
    redirect("/login");
  }
  return session;
};

export const notRequiedAuth = async () => {
  const session = await getAuthSession();
  if (session) {
    redirect("/");
  }
};
