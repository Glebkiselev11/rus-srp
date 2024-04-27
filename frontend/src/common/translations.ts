import type { TranslationObject } from "@/types/translations";
import { TranslationsService } from "@/api";

export async function translate(
  params: TranslationObject
): Promise<TranslationObject> {
  try {
    const { data } = await TranslationsService.translate(params);
    return data;
  } catch (error) {
    console.error(error);
    return params;
  }
}
