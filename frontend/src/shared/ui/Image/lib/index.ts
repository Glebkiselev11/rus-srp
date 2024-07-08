export function addCropImagaeParamsToUrl(src: string, size: number): string {
  const url = new URL(src);
  url.searchParams.append("fit", "crop");
  url.searchParams.append("h", size.toString());
  url.searchParams.append("w", size.toString());
  return url.toString();
}
