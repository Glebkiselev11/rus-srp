import { useSearchParams } from "react-router-dom";
import { IRequestParams, Order } from "../models/api";


export function useCustomSearchParams(): [IRequestParams, (x: IRequestParams) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = {
    search: searchParams.get("search") ?? "",
    offset: Number(searchParams.get("offset") ?? "0"),
    limit: Number(searchParams.get("limit") ?? "20"),
    order: (searchParams.get("order") ?? "-created_at") as Order,
  };

  const isKeyOfIRequestParams = (key: string): key is keyof IRequestParams => key in params;

  const setParams = (newParams: IRequestParams) => {
    if (newParams.search !== params.search) {
      newParams.offset = 0;
    }
    // Remove undefined and empty keys and convert values to string
    const validParams: Record<string, string> = {};
    for (const key in newParams) {
      if (isKeyOfIRequestParams(key) && newParams[key]) {
        validParams[key] = String(newParams[key]);
      }
    }

    setSearchParams(validParams);
  };

  return [params, setParams];
}
