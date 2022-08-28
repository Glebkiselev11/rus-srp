import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Info {
  version: string,
  author: string,
}

export const newWordApi = createApi({
	reducerPath: "newWord/api",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://127.0.0.1:7070"
	}),
	endpoints: build => ({
		// Use void as second paramentr if we do not need any parameters for make request
		info: build.query<Info, void>({
			query: () => "/info"
		})
	})
});

export const { useInfoQuery } = newWordApi;