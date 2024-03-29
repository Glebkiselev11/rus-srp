import type { ListResponse, OptionalRequestParams } from "@/types/api";
import type { Image } from "@/types/images";
import { ApiTransport } from "@/api/apiTransport";

export const ImagesService = {
  ENDPOINT: "/api/v1/private/services/images",

  query(params: OptionalRequestParams) {
    return ApiTransport.query<ListResponse<Image>>(`${this.ENDPOINT}/query`, {
      params,
    });
  },
};
