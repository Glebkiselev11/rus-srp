import { useSearchParams } from "react-router-dom";
import { IRequestParams, Order } from "../models/api";


export function useCustomSearchParams(): [IRequestParams, (x: IRequestParams) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = {
    search: searchParams.get("search") ?? undefined,
    offset: searchParams.get("offset") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
    order: (searchParams.get("order") ?? "-created_at") as Order,
  };

  const isKeyOfIRequestParams = (key: string): key is keyof IRequestParams => key in params;

  const setParams = (newParams: IRequestParams) => {
    // Merge the existing params with the new ones
    const mergedParams: IRequestParams = { ...params, ...newParams };

    // Remove undefined and empty keys and convert values to string
    const validParams: Record<string, string> = {};
    for (const key in mergedParams) {
      if (isKeyOfIRequestParams(key) && mergedParams[key]) {
        validParams[key] = String(mergedParams[key]);
      }
    }

    setSearchParams(validParams);
  };

  return [params, setParams];
}
