import type { ListResponse, OptionalRequestParams } from "@/types/api";
import type { Image } from "@/types/images";
import { ApiTransport } from "../apiTransport";

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
