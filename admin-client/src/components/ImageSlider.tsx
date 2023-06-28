import { IImage } from "../models/image";
import { addCropImagaeParamsToUrl } from "../utils/image";

interface ImageSliderProps {
  images: Array<IImage>;
  selectedImage: string | null;
  selectImageHandler: (src: string) => void;
}

export function ImageSlider({ images, selectedImage, selectImageHandler }: ImageSliderProps) {
  const imageClasses = "h-[150px] w-[150px] object-cover mr-2 shrink-0 cursor-pointer";
  const selectedImageClasses = "border-4 border-purple-400 ";

  return (
    <section className="overflow-x-scroll flex">
      {images.map(({ id, src }) =>
        <img
          key={id}
          className={`${imageClasses} ${selectedImage === src ? selectedImageClasses : ""}`}
          src={addCropImagaeParamsToUrl(src, 300)}
          onClick={() => selectImageHandler(src)}
        />
      )}
    </section>
  );
}
