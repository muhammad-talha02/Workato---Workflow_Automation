import { PAGINATION } from "@/config/constants";
import { useEffect, useState } from "react";

interface EntitySearchProps<T extends { search: string; page: number }> {
  params: T;
  setParams: (params: T) => void;
  delay?: number;
}

export const useEntitySearch = <T extends { search: string; page: number }>({
  params,
  setParams,
  delay = 500,
}: EntitySearchProps<T>) => {
  const [localSearch, setLocalSearch] = useState(params.search);

  // Sync external search → local state (when params change)
  useEffect(() => {
    // setLocalSearch(params.search);
  }, [params.search]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      console.log("TImer", { localSearch, params: params?.search });
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch,
          page: PAGINATION.DEFAULT_PAGE,
        });
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [localSearch, params, setParams, delay]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
};
