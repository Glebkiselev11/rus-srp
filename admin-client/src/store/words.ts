import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { INewWord, IWord } from "../models/index";
import { IListResponse, IRequestParams } from "../models/api";

export const wordsApi = createApi({
	reducerPath: "words/api",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://127.0.0.1:7070/api/v1/words"
	}),
	tagTypes: ["Words"],
	endpoints: build => ({
		createWord: build.mutation<IWord, INewWord>({
			query(body: INewWord) {
				return {
					url: "/create",
					method: "POST",
					body
				};
			},
			invalidatesTags: ["Words"],
		}),
		get: build.query<IWord, string>({
			query(id) {
				return {
					url: `/${id}`,
					method: "GET"
				};
			}
		}),
		getAll: build.query<IListResponse<IWord>, IRequestParams>({
			query(params) {
				return {
					url: "",
					method: "GET",
					params 
				};
			},
			providesTags: ["Words"]
		}),
		delete: build.mutation<any, string>({
			query(id) {
				return {
					url: `/${id}`,
					method: "DELETE",
				};
			},
			invalidatesTags: ["Words"]
		})
	})
});

export const { useCreateWordMutation, useGetAllQuery, useDeleteMutation, useGetQuery } = wordsApi;
