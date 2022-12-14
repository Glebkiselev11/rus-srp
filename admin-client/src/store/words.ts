import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IDraftWord, IWord } from "../models/index";
import { IListResponse, IRequestParams } from "../models/api";

export const wordsApi = createApi({
	reducerPath: "words/api",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://127.0.0.1:7070/api/v1/words"
	}),
	tagTypes: ["Words"],
	endpoints: build => ({
		createWord: build.mutation<IWord, IDraftWord>({
			query(body: IDraftWord) {
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
			},
			providesTags: ["Words"]
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
		update: build.mutation<IWord, IWord>({
			query(body) {
				return {
					url: `/${body.id}`,
					method: "PUT",
					body
				};
			},
			invalidatesTags: ["Words"]
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

export const { useCreateWordMutation, useGetAllQuery, useDeleteMutation, useGetQuery, useUpdateMutation } = wordsApi;
