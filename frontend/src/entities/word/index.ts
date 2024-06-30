export { convertWordToDraftWord } from "./lib";

export { WordsService } from "./api";

export {
  useWordsQuery,
  useWordsInfinityQuery,
  useUpdateWord,
  useCreateWord,
  useDeleteWord,
  KEY,
} from "./model/query";

export type { Word, DraftWord } from "./model/types";
