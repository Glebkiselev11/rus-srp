import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { INewWord, IWord } from "../models/index";
import { IListResponse, IRequestParams } from "../models/api";

export const wordsApi = createApi({
	reducerPath: "words/api",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://127.0.0.1:7070/api/v1/words"
	}),
	endpoints: build => ({
		createWord: build.mutation<IWord, INewWord>({
			query(body: INewWord) {
				return {
					url: "/create",
					method: "POST",
					body
				};
			},
		}),
		getAll: build.query<IListResponse<IWord>, IRequestParams>({
			query(params) {
				return {
					url: "",
					method: "GET",
					params 
				};
			}
		}),
		delete: build.mutation<any, string>({
			query(id) {
				return {
					url: `/${id}`,
					method: "DELETE",
				};
			}
		})
	})
});

export const { useCreateWordMutation, useGetAllQuery, useDeleteMutation } = wordsApi;
