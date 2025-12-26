"use client";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { KeyRoundIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import {
  useRemoveCredential,
  useSusupenseCredentials,
} from "../hooks/use-credential";
import { useCredentialsParams } from "../hooks/use-credential-params";

export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
    delay: 500,
  });
  return (
    <EntitySearch
      value={searchValue}
      // value={params?.search}
      onChange={(value) => onSearchChange(value)}
      placeholder="Search credentials"
    />
  );
};

export const CredentialsPagination = () => {
  const credentials = useSusupenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
      page={credentials?.data?.page}
      onPageChange={(value) => setParams({ ...params, page: value })}
      totalPages={credentials?.data?.totalPages}
      disabled={credentials?.isFetching}
    />
  );
};

export const CredentialsList = () => {
  const credentials = useSusupenseCredentials();

  return (
    <EntityList
      items={credentials?.data?.items}
      getKey={(credential) => credential.id}
      renderItem={(item) => {
        return <CredentialItem data={item} />;
      }}
      emptyView={<CredentialsEmpty />}
    />
  );
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <>
      <EntityHeader
        title="Credentials"
        description="Create and manage your credentials"
        newButtonLabel="New credential"
        newButtonHref={"/credentials/new"}
        disabled={disabled}
      />
    </>
  );
};

export const CredentialsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsLoading = () => {
  return <LoadingView message="Loading credentials...." />;
};

export const CredentialsError = () => {
  return <ErrorView message="Error Loading credentials." />;
};

export const CredentialsEmpty = () => {
  const router = useRouter();

  const handleCreateCredential = () => {
    router.push(`/credentials/new`);
  };
  return (
    <>
      <EmptyView
        message="You haven't created any credentail yet. Get started by creating your first credentail"
        onNew={handleCreateCredential}
      />
    </>
  );
};

export const CredentialItem = ({ data }: { data: Credential }) => {
  const removeCredential = useRemoveCredential();
  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.type}
      image={
        <div className="size-8 flex items-center justify-center">
          <KeyRoundIcon className="size-5 text-muted-foreground" />
        </div>
      }
      onRemove={() => removeCredential.mutate({ id: data?.id })}
      isRemoving={removeCredential.isPending}
    />
  );
};
