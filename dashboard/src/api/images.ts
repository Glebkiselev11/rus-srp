import type { ListResponse, OptionalRequestParams } from "@/types/api";
import type { Image } from "@/types/images";
import axios, { type AxiosResponse } from "axios";

export const ImagesApi = {
  ENDPOINT: "/api/v1/private/services/images",

  query(
    params: OptionalRequestParams
  ): Promise<AxiosResponse<ListResponse<Image>>> {
    return axios.get(`${this.ENDPOINT}/query`, { params });
  },
};
