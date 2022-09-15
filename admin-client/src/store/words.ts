import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IListResponse, INewWord, IWord } from "../models/index";

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
		getAll: build.query<IListResponse<IWord>, number>({
			query(offset: number) {
				return {
					url: "",
					method: "GET",
					params: { offset }
				};
			}
		})
	})
});

export const { useCreateWordMutation, useGetAllQuery } = wordsApi;
