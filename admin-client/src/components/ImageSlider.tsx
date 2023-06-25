import { IImage } from "../models/image";

interface ImageSliderProps {
  images: Array<IImage>;
  selectedImage: string | null;
  selectImageHandler: (src: string) => void;
}

export function ImageSlider({images, selectedImage, selectImageHandler }: ImageSliderProps) {

  const addCropImagaeParamsToUrl = (src: string): string => {
    const url = new URL(src);
    url.searchParams.append("fit", "crop");
    url.searchParams.append("h", "300");
    url.searchParams.append("w", "300");
    return url.toString();
  };

  const imageClasses = "h-[150px] w-[150px] object-cover mr-2 shrink-0 cursor-pointer";
  const selectedImageClasses = "border-4 border-purple-400 ";

  return (
    <section className="overflow-x-scroll flex">
      {images.map(({id, src}) =>
        <img
          key={id}
          className={`${imageClasses} ${selectedImage === src ? selectedImageClasses : ""}`}
          src={addCropImagaeParamsToUrl(src)}
          onClick={() => selectImageHandler(src)}
        />
      )}
    </section>
  );
}
