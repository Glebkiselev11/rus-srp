import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ITranslateResponse, ITranslateRequest } from "../models/api";
import { constructUrl} from "../utils/api";

export const translateApi = createApi({
  reducerPath: "translate/api",
  baseQuery: fetchBaseQuery({
    baseUrl: constructUrl("api/v1/services/translation"),
  }),
  endpoints: (build) => ({
    translate: build.mutation<ITranslateResponse, ITranslateRequest>({
      query(body: ITranslateRequest) {
        return {
          url: "/translate",
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useTranslateMutation } = translateApi;
