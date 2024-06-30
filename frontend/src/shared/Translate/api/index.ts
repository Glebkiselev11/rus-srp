import type { TranslationObject } from "../model/types";
import { ApiTransport } from "@/shared/api";

export const TranslationsService = {
  ENDPOINT: "/api/v1/private/services/translation",

  translate(params: TranslationObject) {
    return ApiTransport.post<TranslationObject>(
      `${this.ENDPOINT}/translate`,
      params
    );
  },
};
