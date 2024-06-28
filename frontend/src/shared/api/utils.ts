import axios, { type AxiosResponse } from "axios";
import type { Load } from "@/types/api";

type Service<T, R> = {
  query: (query: T) => Promise<AxiosResponse<R>>;
};

export const fetchOptions = async <T, R>(
  service: Service<T, R>,
  query: T,
  setState: (x: Load) => void
) => {
  setState("loading");

  try {
    const result = await service.query(query);
    setState("loaded");
    return result;
  } catch (e) {
    if (axios.isCancel(e)) return;
    setState("error");
    throw e;
  }
};
