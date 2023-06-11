import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ITranslateResponse, ITranslateRequest } from "../models/api";

export const translateApi = createApi({
	reducerPath: "translate/api",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://127.0.0.1:8080/api/v1/translation-service"
	}),
	endpoints: build => ({
		translate: build.mutation<ITranslateResponse, ITranslateRequest>({
			query(body: ITranslateRequest) {
				return {
					url: "/translate",
					method: "POST",
					body
				};
			},
		}),

	})
});

export const { useTranslateMutation } = translateApi;
