import { IImage } from "../models/image";

interface ImageSliderProps {
  images: Array<IImage>;
}

export function ImageSlider({images}: ImageSliderProps) {

  const addCropImagaeParamsToUrl = (src: string): string => {
    const url = new URL(src);
    url.searchParams.append("fit", "crop");
    url.searchParams.append("h", "300");
    url.searchParams.append("w", "300");
    return url.toString();
  };

  return (
    <section className="overflow-x-scroll flex">
      {images.map(({id, src}) =>
        <img
          key={id}
          className="h-[150px] w-[150px] object-cover mr-2 shrink-0"
          src={addCropImagaeParamsToUrl(src)}
        />
      )}
    </section>
  );
}
