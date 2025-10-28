
import { requiredAuth } from "@/lib/better-auth/auth-utils";
import { caller } from "@/trpc/server";
// import { authClient } from "@/lib/better-auth/auth-client";

const Page =  async () => {
 await requiredAuth()
 const user = await caller.getUsers()
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      {/* {JSON.stringify(session)} */}
      {JSON.stringify(user)}
      {/* <Button onClick={async ()=>await auth.api.signOut()}>Logout</Button> */}
      Proected Ryte
    </div>
  );
};

export default Page;
