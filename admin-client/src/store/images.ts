import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {  IListResponse, IRequestParams } from "../models/api";
import { constructUrl} from "../utils/api";
import { IImage } from "../models/image";

export const imagesApi = createApi({
  reducerPath: "images/api",
  baseQuery: fetchBaseQuery({
    baseUrl: constructUrl("api/v1/services/images"),
  }),
  endpoints: (build) => ({
    search: build.query<IListResponse<IImage>, IRequestParams>({
      query(params) {
        return {
          url: "/query",
          method: "GET",
          params,
        };
      },
    }),
  }),
});

export const { useSearchQuery, useLazySearchQuery } = imagesApi;
