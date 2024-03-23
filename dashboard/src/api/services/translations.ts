import type { TranslationObject } from "@/types/translations";
import { ApiTransport } from "@/api/apiTransport";

export const TranslationsService = {
  ENDPOINT: "/api/v1/private/services/translation",

  translate(params: TranslationObject) {
    return ApiTransport.post<TranslationObject>(
      `${this.ENDPOINT}/translate`,
      params
    );
  },
};
