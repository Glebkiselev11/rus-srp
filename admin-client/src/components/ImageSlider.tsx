import { IImage } from "../models/image";

interface ImageSliderProps {
  images: Array<IImage>;
}

export function ImageSlider({images}: ImageSliderProps) {
  return (
    <section className="overflow-x-scroll flex">
      {images.map(({id, src}) =>
        <img
          key={id}
          className="h-[150px] w-[150px] object-cover mr-2 shrink-0"
          src={src.portrait}
        />
      )}
    </section>
  );
}
