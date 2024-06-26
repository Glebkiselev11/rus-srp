import type { ListResponse, OptionalRequestParams } from "@/shared/types";
import type { Image } from "../model/types";
import { ApiTransport } from "@/shared/api";

export const ImagesService = {
  ENDPOINT: "/api/v1/private/services/images",

  async query(params: OptionalRequestParams) {
    const { data } = await ApiTransport.query<ListResponse<Image>>(
      `${this.ENDPOINT}/query`,
      {
        params,
      }
    );

    return {
      images: data.result,
      count: data.count,
      offset: data.offset,
    };
  },
};
