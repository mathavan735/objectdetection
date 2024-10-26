export interface Detection {
  class: string;
  score: number;
  bbox: [number, number, number, number];
}