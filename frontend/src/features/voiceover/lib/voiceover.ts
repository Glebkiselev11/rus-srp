import type { Lang } from "../model/types";

const audio = new Audio();

export async function playText(text: string, lang: Lang) {
  const url =
    "https://translate.google.com/translate_tts" +
    "?client=gtx" +
    "&ie=UTF-8" +
    "&tl=" +
    encodeURIComponent(lang) +
    "&q=" +
    encodeURIComponent(text);

  audio.src = url;

  return new Promise((resolve, reject) => {
    audio.onended = resolve;
    audio.onerror = reject;
    audio.play();
  });
}
