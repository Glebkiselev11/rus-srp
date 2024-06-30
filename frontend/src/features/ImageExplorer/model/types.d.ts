export type PreviewSize =
  | "24px"
  | "32px"
  | "40px"
  | "48px"
  | "56px"
  | "64px"
  | "96px";

export type Image = {
  id: number;
  width: number;
  height: number;
  avg_color: number;
  src: string;
};
