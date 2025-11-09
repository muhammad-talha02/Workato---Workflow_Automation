import { requiredAuth } from "@/lib/better-auth/auth-utils";

interface PageProps {
  params: Promise<{ credentialId: string }>;
}

const Page = async ({ params }: PageProps) => {
  await requiredAuth();

  const { credentialId } = await params;
  return <div>Credientail Id: {credentialId}</div>;
};

export default Page;
