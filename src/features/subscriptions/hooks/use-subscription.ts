import { authClient } from "@/lib/better-auth/auth-client";
import { useQuery } from "@tanstack/react-query";

export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data } = await authClient.customer.state();
      return data;
    },
  });
};

export const useHasActiveSubscription = () => {
  const { data: customerState, isLoading, ...rest } = useSubscription();
  const hasActiveSubcription =
    customerState?.activeSubscriptions &&
    customerState.activeSubscriptions?.length > 0;

  return {
    hasActiveSubcription,
    subscription: customerState?.activeSubscriptions?.[0],
    isLoading,
    ...rest,
  };
};
