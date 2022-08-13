import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const api = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: ""
	}),
	endpoints: build => ({
		hello: build.query({
			query: () => "/hello"
		})
	})
});

