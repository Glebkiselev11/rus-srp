const audio = new Audio();

export type Lang = "sr" | "en" | "ru";

export async function play(text: string, lang = "sr") {
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
