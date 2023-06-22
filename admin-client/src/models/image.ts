export interface IImage {
  id: number;
  width: number;
  height: number;
  avg_color: number;
  src: {
    original: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  }
}
