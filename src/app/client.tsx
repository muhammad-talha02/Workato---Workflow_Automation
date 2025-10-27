"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const Client = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: users } = useSuspenseQuery(trpc.getUsers.queryOptions());
  return (
    <div>
      Client
      {JSON.stringify(users)}
      <br />
      <button onClick={() => router.refresh()}>Refetch</button>
    </div>
  );
};

export default Client;
