import { getLanguageCodesAccordingText } from "./index";
import { expect, test } from "vitest";

testGetLanguageCodesAccordingText("word", ["eng"]);
testGetLanguageCodesAccordingText("Hello", ["srp_latin", "eng"]);
testGetLanguageCodesAccordingText("Зеленый автомобиль", ["rus"]);
testGetLanguageCodesAccordingText("Здраво", ["rus", "srp_cyrillic"]);
testGetLanguageCodesAccordingText("Јабука", ["srp_cyrillic"]);
testGetLanguageCodesAccordingText("Doviđenja", ["srp_latin"]);

function testGetLanguageCodesAccordingText(text: string, result: string[]) {
  test(`'${text}' should be ${result}`, () => {
    expect(getLanguageCodesAccordingText(text)).toStrictEqual(result);
  });
}
